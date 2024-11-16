document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleBtn');
    const mainContent = document.getElementById('mainContent');

    toggleBtn.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('shifted');
    });

    // Инициализация календаря
    const calendarDates = document.getElementById('calendarDates');
    const currentMonthElement = document.getElementById('currentMonth');
    const selectedDateElement = document.getElementById('selectedDate');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');

    let currentDate = new Date();
    let selectedStartDate = null;
    let selectedEndDate = null;

    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDay = firstDay.getDay();

        currentMonthElement.textContent = firstDay.toLocaleString('default', { month: 'long', year: 'numeric' });
        calendarDates.innerHTML = '';

        for (let i = 0; i < startDay; i++) {
            const emptyDate = document.createElement('div');
            emptyDate.classList.add('date');
            calendarDates.appendChild(emptyDate);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dateElement = document.createElement('div');
            dateElement.classList.add('date');
            dateElement.textContent = i;
            dateElement.addEventListener('click', () => selectDate(i));
            calendarDates.appendChild(dateElement);
        }

        if (selectedStartDate) {
            const startDateElement = document.querySelector(`.date:nth-child(${selectedStartDate.getDate() + startDay})`);
            if (startDateElement) {
                startDateElement.classList.add('start-date');
            }
        }

        if (selectedEndDate) {
            const endDateElement = document.querySelector(`.date:nth-child(${selectedEndDate.getDate() + startDay})`);
            if (endDateElement) {
                endDateElement.classList.add('end-date');
            }
        }

        if (selectedStartDate && selectedEndDate) {
            const startDate = selectedStartDate.getDate() + startDay;
            const endDate = selectedEndDate.getDate() + startDay;
            for (let i = startDate + 1; i < endDate; i++) {
                const inRangeDateElement = document.querySelector(`.date:nth-child(${i})`);
                if (inRangeDateElement) {
                    inRangeDateElement.classList.add('in-range');
                }
            }
        }
    }

    function selectDate(day) {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const selectedDate = new Date(year, month, day);

        if (!selectedStartDate || selectedEndDate) {
            selectedStartDate = selectedDate;
            selectedEndDate = null;
        } else {
            if (selectedDate < selectedStartDate) {
                selectedEndDate = selectedStartDate;
                selectedStartDate = selectedDate;
            } else {
                selectedEndDate = selectedDate;
            }
        }

        selectedDateElement.value = `${selectedStartDate.toLocaleDateString('en-US')} - ${selectedEndDate ? selectedEndDate.toLocaleDateString('en-US') : ''}`;
        renderCalendar();
    }

    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    renderCalendar();

    // Настройка перетаскивания с помощью interact.js
    interact('.draggable').draggable({
        inertia: true,
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: 'main', // Ограничиваем перетаскивание областью main
                endOnly: true
            })
        ],
        listeners: {
            move: dragMoveListener
        }
    });

    function dragMoveListener(event) {
        const target = event.target;
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        target.style.transform = `translate(${x}px, ${y}px)`;
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    }
});
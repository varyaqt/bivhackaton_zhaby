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
        const startDay = (firstDay.getDay() + 6) % 7; // Начинаем с понедельника

        currentMonthElement.textContent = firstDay.toLocaleString('ru-RU', { month: 'long', year: 'numeric' });
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

        selectedDateElement.value = `${formatDate(selectedStartDate)} - ${selectedEndDate ? formatDate(selectedEndDate) : ''}`;
        renderCalendar();
    }

    function formatDate(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
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

    const newArticleBtn = document.getElementById('newArticleBtn');
    const newArticleForm = document.getElementById('newArticleForm');
    const newArticleInput = document.getElementById('newArticleInput');
    const createArticleBtn = document.getElementById('createArticleBtn');
    const draggableItems = document.getElementById('draggableItems');
    const insuranceTypeSelect = document.getElementById('insuranceType');
    const dynamicFields = document.getElementById('dynamicFields');

    const fieldsConfig = {
        medical: [
            { label: 'Номер полиса', type: 'text' },
            { label: 'Дата начала', type: 'date' },
            { label: 'Дата окончания', type: 'date' }
        ],
        car: [
            { label: 'Номер автомобиля', type: 'text' },
            { label: 'Марка', type: 'text' },
            { label: 'Модель', type: 'text' }
        ],
        property: [
            { label: 'Адрес', type: 'text' },
            { label: 'Тип имущества', type: 'text' },
            { label: 'Стоимость', type: 'number' }
        ]
    };

    function renderFields(type) {
        dynamicFields.innerHTML = ''; // Очищаем контейнер

        const fields = fieldsConfig[type];
        if (fields) {
            fields.forEach(field => {
                const div = document.createElement('div');
                const label = document.createElement('label');
                label.textContent = field.label;
                const input = document.createElement('input');
                input.type = field.type;
                input.name = field.label.toLowerCase().replace(' ', '_');

                div.appendChild(label);
                div.appendChild(input);
                dynamicFields.appendChild(div);
            });
        }
    }

    insuranceTypeSelect.addEventListener('change', function() {
        const selectedType = insuranceTypeSelect.value;
        renderFields(selectedType);
    });

    // Инициализация полей при загрузке страницы
    renderFields(insuranceTypeSelect.value);

    newArticleBtn.addEventListener('click', function() {
        newArticleForm.style.display = 'block';
    });

    createArticleBtn.addEventListener('click', function(event) {
        event.preventDefault(); // Предотвращаем отправку формы

        const newItemText = newArticleInput.value.trim();
        const selectedType = insuranceTypeSelect.value;
        const fields = fieldsConfig[selectedType];
        const fieldValues = {};

        fields.forEach(field => {
            const input = document.querySelector(`input[name="${field.label.toLowerCase().replace(' ', '_')}"]`);
            fieldValues[field.label] = input.value;
        });

        // Проверяем, что поле newArticleInput заполнено
        if (newItemText === '') {
            alert('Пожалуйста, введите название элемента.');
            return;
        }

        if (newItemText || Object.keys(fieldValues).length > 0) {
            const newItem = document.createElement('div');
            newItem.className = 'draggable-item';
            newItem.innerHTML = `
                <p>Созданный элемент: ${newItemText}</p>
                <p>Тип страхования: ${selectedType}</p>
                <p>Значения полей: ${JSON.stringify(fieldValues)}</p>
            `;

            // Изменяем стиль параграфов
            const paragraphs = newItem.querySelectorAll('p');
            paragraphs.forEach(paragraph => {
                paragraph.style.color = 'var(--color-text)';
                paragraph.style.fontSize = '20px';
                paragraph.style.fontWeight = "bold";
                paragraph.style.marginBottom = '5px';
            });

            draggableItems.appendChild(newItem);

            newArticleInput.value = '';
            newArticleForm.style.display = 'none';

            // Настройка перетаскивания с помощью interact.js
            interact(newItem).draggable({
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
        }
    });

    const draggableWindow = document.getElementById('draggableWindow');
    const windowHeader = document.getElementById('windowHeader');

    let isDragging = false;
    let offsetX, offsetY;

    windowHeader.addEventListener('mousedown', function(e) {
        isDragging = true;
        offsetX = e.clientX - draggableWindow.offsetLeft;
        offsetY = e.clientY - draggableWindow.offsetTop;
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            const newX = e.clientX - offsetX;
            const newY = e.clientY - offsetY;

            // Ограничиваем перетаскивание областью mainContent
            const mainContentRect = mainContent.getBoundingClientRect();
            const draggableWindowRect = draggableWindow.getBoundingClientRect();

            if (newX < mainContentRect.left) {
                draggableWindow.style.left = mainContentRect.left + 'px';
            } else if (newX + draggableWindowRect.width > mainContentRect.right) {
                draggableWindow.style.left = mainContentRect.right - draggableWindowRect.width + 'px';
            } else {
                draggableWindow.style.left = newX + 'px';
            }

            if (newY < mainContentRect.top) {
                draggableWindow.style.top = mainContentRect.top + 'px';
            } else if (newY + draggableWindowRect.height > mainContentRect.bottom) {
                draggableWindow.style.top = mainContentRect.bottom - draggableWindowRect.height + 'px';
            } else {
                draggableWindow.style.top = newY + 'px';
            }
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });
});
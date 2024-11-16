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
    const categoryIcons = document.querySelectorAll('input[name="category"]');
    const existingTemplates = document.getElementById('existingTemplates');
    const createNewElementBtn = document.getElementById('createNewElementBtn');
    const newElementForm = document.getElementById('newElementForm');
    const newElementName = document.getElementById('newElementName');
    const newElementType = document.getElementById('newElementType');
    const newElementDependency = document.getElementById('newElementDependency');
    const saveNewElementBtn = document.getElementById('saveNewElementBtn');
    const draggableItems = document.getElementById('draggableItems');

    const templates = {
        medical: [
            { name: 'Полис человека', type: 'text' },
            { name: 'Дата начала', type: 'date' },
            { name: 'Дата окончания', type: 'date' }
        ],
        car: [
            { name: 'Номер автомобиля', type: 'text' },
            { name: 'Марка', type: 'text' },
            { name: 'Модель', type: 'text' }
        ],
        person: [
            { name: 'ФИО', type: 'text' },
            { name: 'Регион проживания', type: 'text' }
        ],
        house: [
            { name: 'Адрес', type: 'text' },
            { name: 'Владелец', type: 'text' }
        ]
    };

    function renderTemplates(category) {
        existingTemplates.innerHTML = '';
        templates[category].forEach(template => {
            const templateElement = document.createElement('div');
            templateElement.className = 'template';
            templateElement.textContent = template.name;
            templateElement.addEventListener('click', () => addTemplateToMain(template));
            existingTemplates.appendChild(templateElement);
        });
    }

    function addTemplateToMain(template) {
        const newItem = document.createElement('div');
        newItem.className = 'draggable-item';
        newItem.innerHTML = `
            <p><b>${template.name}</b></p>
            ${getInputField(template.type)}
        `;
        draggableItems.appendChild(newItem);

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

    function getInputField(type) {
        switch (type) {
            case 'text':
                return '<input type="text" placeholder="Введите текст">';
            case 'number':
                return '<input type="number" placeholder="Введите число">';
            case 'date':
                return '<input type="date">';
            default:
                return '';
        }
    }

    categoryIcons.forEach(icon => {
        icon.addEventListener('change', function() {
            renderTemplates(this.value);
        });
    });

    newArticleBtn.addEventListener('click', function() {
        newArticleForm.style.display = 'block';
        renderTemplates(document.querySelector('input[name="category"]:checked').value);
    });

    createNewElementBtn.addEventListener('click', function() {
        newElementForm.style.display = 'block';
    });

    saveNewElementBtn.addEventListener('click', function() {
        const name = newElementName.value.trim();
        const type = newElementType.value;
        const dependency = newElementDependency.value;

        if (name === '') {
            alert('Пожалуйста, введите название элемента.');
            return;
        }

        const newTemplate = { name, type, dependency };
        const selectedCategory = document.querySelector('input[name="category"]:checked').value;
        templates[selectedCategory].push(newTemplate);

        renderTemplates(selectedCategory);
        newElementForm.style.display = 'none';
        newElementName.value = '';
        newElementType.value = 'text';
        newElementDependency.value = '';
    });

    // Инициализация шаблонов для начальной категории
    renderTemplates('medical');

    const dependencyBtn = document.getElementById('dependencyBtn');
    const dependencyWindow = document.getElementById('dependencyWindow');
    const closeDependencyBtn = document.getElementById('closeDependencyBtn');

    dependencyBtn.addEventListener('click', function() {
        dependencyWindow.style.display = 'block';
    });

    closeDependencyBtn.addEventListener('click', function() {
        dependencyWindow.style.display = 'none';
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
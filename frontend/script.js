document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleBtn');
    const mainContent = document.getElementById('mainContent');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            if (sidebar && mainContent) {
                sidebar.classList.toggle('collapsed');
                mainContent.classList.toggle('shifted');
            } else {
                console.error('Элементы sidebar или mainContent не найдены');
            }
        });
    } else {
        console.error('Элемент toggleBtn не найден');
    }

    // Инициализация календаря
    const calendarDates = document.getElementById('calendarDates');
    const currentMonthElement = document.getElementById('currentMonth');
    const selectedDateElement = document.getElementById('selectedDate');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');

    if (calendarDates && currentMonthElement && selectedDateElement && prevMonthBtn && nextMonthBtn) {
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

            if (!selectedDateElement) {
                console.error('Элемент selectedDateElement не найден');
                return;
            }

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

        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() - 1);
                renderCalendar();
            });
        } else {
            console.error('Элемент prevMonthBtn не найден');
        }

        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() + 1);
                renderCalendar();
            });
        } else {
            console.error('Элемент nextMonthBtn не найден');
        }

        renderCalendar();
    } else {
        console.error('Один или несколько элементов календаря не найдены');
    }

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
        if (!target) {
            console.error('Целевой элемент не найден');
            return;
        }

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
        // Добавьте другие категории и шаблоны по аналогии
    };

    const dependencies = {};

    function renderTemplates(category) {
        if (!existingTemplates) {
            console.error('Элемент existingTemplates не найден');
            return;
        }

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
        if (!draggableItems) {
            console.error('Элемент draggableItems не найден');
            return;
        }

        const newItem = document.createElement('div');
        newItem.className = 'draggable-item';
        newItem.innerHTML = `
            <p>${template.name}</p>
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

    if (newArticleBtn) {
        newArticleBtn.addEventListener('click', function() {
            if (newArticleForm) {
                newArticleForm.style.display = 'block';
                renderTemplates(document.querySelector('input[name="category"]:checked').value);
            } else {
                console.error('Элемент newArticleForm не найден');
            }
        });
    } else {
        console.error('Элемент newArticleBtn не найден');
    }

    function populateDependencyOptions() {
        const dependencySelect = document.getElementById('newElementDependency');
        if (!dependencySelect) {
            console.error('Элемент newElementDependency не найден');
            return;
        }

        // Очищаем текущие опции
        dependencySelect.innerHTML = '<option value="">Нет зависимости</option>';

        // Добавляем все существующие элементы из шаблонов
        for (const category in templates) {
            templates[category].forEach(template => {
                const option = document.createElement('option');
                option.value = template.name;
                option.textContent = template.name;
                dependencySelect.appendChild(option);
            });
        }

        // Добавляем сохраненные зависимости
        for (const element in dependencies) {
            dependencies[element].forEach(dependency => {
                const option = document.createElement('option');
                option.value = dependency;
                option.textContent = `${element} зависит от ${dependency}`;
                dependencySelect.appendChild(option);
            });
        }
    }

    if (createNewElementBtn) {
        createNewElementBtn.addEventListener('click', function() {
            if (newElementForm) {
                newElementForm.style.display = 'block';
                populateDependencyOptions(); // Заполняем выпадающий список зависимостей
            } else {
                console.error('Элемент newElementForm не найден');
            }
        });
    } else {
        console.error('Элемент createNewElementBtn не найден');
    }

    if (saveNewElementBtn) {
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

            // Сохраняем зависимость
            if (dependency) {
                if (!dependencies[name]) {
                    dependencies[name] = [];
                }
                dependencies[name].push(dependency);
            }

            renderTemplates(selectedCategory);
            if (newElementForm) {
                newElementForm.style.display = 'none';
            } else {
                console.error('Элемент newElementForm не найден');
            }
            newElementName.value = '';
            newElementType.value = 'text';
            newElementDependency.value = '';

            // Обновляем выпадающий список зависимостей
            populateDependencyOptions();
        });
    } else {
        console.error('Элемент saveNewElementBtn не найден');
    }

    // Инициализация шаблонов для начальной категории
    renderTemplates('medical');

    const dependencyBtns = document.querySelectorAll('.dependencyBtn');
    const dependencyWindow = document.getElementById('dependencyWindow');
    const closeDependencyBtn = document.getElementById('closeDependencyBtn');
    const dependencyField1 = document.getElementById('dependencyField1');
    const dependencyField2 = document.getElementById('dependencyField2');
    const addDependencyBtn = document.getElementById('addDependencyBtn');
    const dependencyList = document.getElementById('dependencyList');

    const fieldNames = {
        currency: 'Валюта страховой суммы',
        organization: 'Тип организации страхования',
        'Регион проживания': 'Регион проживания',
        'Город проживания': 'Город проживания'
    };

    // Функция для получения всех элементов из базы данных
    function fetchElements() {
        fetch('/api/property') // Замените на ваш API endpoint
            .then(response => response.json())
            .then(data => {
                data.forEach(element => {
                    fieldNames[element.name] = element.name;
                });
            })
            .catch(error => console.error('Ошибка при получении элементов:', error));
    }

    // Функция для получения всех типов элементов из базы данных
    function fetchPropertyTypes() {
        fetch('/api/property/type') // Замените на ваш API endpoint
            .then(response => response.json())
            .then(data => {
                data.forEach(type => {
                    fieldNames[type.name] = type.name;
                });
            })
            .catch(error => console.error('Ошибка при получении типов элементов:', error));
    }

    // Вызываем функции для получения элементов и типов элементов при загрузке страницы
    fetchElements();
    fetchPropertyTypes();

    dependencyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (dependencyWindow) {
                dependencyWindow.style.display = 'block';
                // Очищаем список зависимостей
                dependencyList.innerHTML = '';
                // Отображаем сохраненные зависимости
                for (const element in dependencies) {
                    dependencies[element].forEach(dependency => {
                        const dependencyItem = document.createElement('div');
                        dependencyItem.className = 'dependency-item';
                        dependencyItem.textContent = `${fieldNames[element]} зависит от ${fieldNames[dependency]}`;
                        dependencyList.appendChild(dependencyItem);
                    });
                }
            } else {
                console.error('Элемент dependencyWindow не найден');
            }
        });
    });

    if (closeDependencyBtn) {
        closeDependencyBtn.addEventListener('click', function() {
            if (dependencyWindow) {
                dependencyWindow.style.display = 'none';
            } else {
                console.error('Элемент dependencyWindow не найден');
            }
        });
    } else {
        console.error('Элемент closeDependencyBtn не найден');
    }

    if (addDependencyBtn) {
        addDependencyBtn.addEventListener('click', function() {
            const field1 = dependencyField1.value;
            const field2 = dependencyField2.value;

            if (field1 && field2 && field1 !== field2) {
                const dependencyItem = document.createElement('div');
                dependencyItem.className = 'dependency-item';
                dependencyItem.textContent = `${fieldNames[field1]} зависит от ${fieldNames[field2]}`;
                if (dependencyList) {
                    dependencyList.appendChild(dependencyItem);
                } else {
                    console.error('Элемент dependencyList не найден');
                }

                // Сохраняем зависимость
                if (!dependencies[field1]) {
                    dependencies[field1] = [];
                }
                dependencies[field1].push(field2);

                // Обновляем выпадающий список зависимостей
                populateDependencyOptions();
            }
        });
    } else {
        console.error('Элемент addDependencyBtn не найден');
    }

    const draggableWindow = document.getElementById('draggableWindow');
    const windowHeader = document.getElementById('windowHeader');

    if (windowHeader) {
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
    } else {
        console.error('Элемент windowHeader не найден');
    }
});
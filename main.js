// Получаем элементы DOM
const dlg = document.getElementById('contactDialog');      // Модальное окно
const openBtn = document.getElementById('openDialog');     // Кнопка открытия диалога
const closeBtn = document.getElementById('closeDialog');   // Кнопка закрытия диалога
const form = document.getElementById('contactForm');       // Форма обратной связи
let lastActive = null;                                     // Для запоминания последнего активного элемента

// Обработчик открытия модального окна
openBtn.addEventListener('click', () => {
    lastActive = document.activeElement;                   // Запоминаем текущий активный элемент (для возврата фокуса)
    dlg.showModal();                                       // Показываем модальное окно
    // Автоматически фокусируемся на первом поле формы для удобства пользователя
    dlg.querySelector('input,select,textarea,button')?.focus();
});

// Обработчик закрытия модального окна по кнопке "Закрыть"
closeBtn.addEventListener('click', () => dlg.close('cancel'));

// Обработчик отправки формы
form?.addEventListener('submit', (e) => {
    // Сбрасываем все кастомные сообщения об ошибках
    [...form.elements].forEach(el => el.setCustomValidity?.(''));

    // Проверяем валидность формы
    if (!form.checkValidity()) {
        e.preventDefault();  // Отменяем стандартную отправку формы
        
        // Специальная проверка для email поля
        const email = form.elements.email;
        if (email?.validity.typeMismatch) {
            // Устанавливаем кастомное сообщение об ошибке для email
            email.setCustomValidity('Введите корректный e-mail, например name@example.com');
        }
        
        form.reportValidity();  // Показываем сообщения об ошибках

        [...form.elements].forEach(el => {
            if (el.willValidate) el.toggleAttribute('aria-invalid', !el.checkValidity());
        });
        return;  // Прерываем выполнение если форма невалидна
    }

    // Если форма валидна:
    e.preventDefault();  // Отменяем стандартную отправку (так как нет бэкенда)
    document.getElementById('contactDialog')?.close('success');  // Закрываем диалог с статусом 'success'
    form.reset();  // Сбрасываем значения формы
});

// Обработчик события закрытия диалога
dlg.addEventListener('close', () => { 
    lastActive?.focus();  // Возвращаем фокус на элемент, который был активен до открытия диалога
});

// Маска для телефона
const phone = document.getElementById('phone');
phone?.addEventListener('input', () => {
    // Оставляем только цифры и обрезаем до 11 символов
    const digits = phone.value.replace(/\D/g,'').slice(0,11);
    // Заменяем первую 8 на 7 (российский формат)
    const d = digits.replace(/^8/, '7');
    
    // Форматируем номер по шаблону: +7 (XXX) XXX-XX-XX
    const parts = [];
    if (d.length > 0) parts.push('+7');
    if (d.length > 1) parts.push(' (' + d.slice(1,4));
    if (d.length >= 4) parts[parts.length - 1] += ')';
    if (d.length >= 5) parts.push(' ' + d.slice(4,7));
    if (d.length >= 8) parts.push('-' + d.slice(7,9));
    if (d.length >= 10) parts.push('-' + d.slice(9,11));
    
    phone.value = parts.join('');  // Устанавливаем отформатированное значение
});

// Устанавливаем паттерн валидации для телефона (регулярное выражение)
phone?.setAttribute('pattern', '^\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}$');
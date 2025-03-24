# Drone Flight Animation

Цей проєкт ілюструє анімацію руху дрона на основі даних, що зберігаються у файлі JSON. За допомогою HTML, CSS та JavaScript створено інтерактивне полотно, на якому зображається шлях дрона та анімація його руху. Дрон рухається за заданими координатами і змінює напрямок у відповідності до значень швидкості і кута.

## Опис

У застосунку:

- **Дрон** рухається по заданому шляху.
- Шлях зображений блакитною лінією.
- Дрон відображається як зображення, яке рухається в напрямку свого польоту.
- Дрон починає рухати після натискання кнопки "Почати".

## Для запуску

### 1. Встановлення залежностей

Для роботи проєкту потрібно встановити **JSON Server**. Виконай наступну команду для глобальної установки:

```bash
npm install -g json-server
```

### 2. Запуск JSON Server

Переконайся, що у папці проєкту є файл data.json з масивом об'єктів (даними польоту). Потім запусти сервер:

```bash
json-server --watch data.json --port 3000
```
### 3. Запуск фронтенду

Відкрий файл index.html за допомогою Live Server (або просто відкрий його у браузері). Якщо використовуєш VS Code, запусти Live Server:
```bash

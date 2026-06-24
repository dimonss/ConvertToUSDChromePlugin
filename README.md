# Convert Price to USD Chrome Extension

Chrome extension for converting car listing prices from KZT to USD on kolesa.kz pages.

The extension opens a small popup where you enter the current KZT to USD exchange rate. After clicking **Convert**, prices on the active kolesa.kz listing page are replaced with approximate USD values. Click **Reset** to restore the original prices.

## Features

- Converts visible kolesa.kz listing prices from KZT to USD.
- Lets you set the exchange rate manually.
- Restores original prices without reloading the page.
- Uses a simple Chrome Manifest V3 extension structure.

## Project Structure

```text
.
├── manifest.json
├── popup.html
├── popup.css
├── popup.js
└── icon.png
```

## Detailed Installation in Chrome

This extension is installed manually as an unpacked Chrome extension.

1. Download or clone this project to your computer.

   If you use Git:

   ```bash
   git clone <repository-url>
   ```

   If you downloaded a ZIP archive, extract it first.

2. Open Google Chrome.

3. In the address bar, open:

   ```text
   chrome://extensions
   ```

4. Enable **Developer mode**.

   The switch is usually in the top-right corner of the Extensions page.

5. Click **Load unpacked**.

6. Select the project folder that contains `manifest.json`.

   Select the root folder of this project, not an individual file.

7. After loading, Chrome should show the extension named **Convert price to USD** in the extensions list.

8. Open a kolesa.kz listing page.

9. Click the extensions icon in the Chrome toolbar and pin **Convert price to USD** if you want quick access.

10. Click the extension icon, enter the current exchange rate, and press **Convert**.

If you change extension files later, go back to `chrome://extensions` and click the reload button on the extension card.

## Usage

1. Open a kolesa.kz page with listing prices.
2. Click the extension icon in the Chrome toolbar.
3. Enter the current KZT to USD exchange rate.
4. Click **Convert**.
5. Click **Reset** to return prices to their original KZT values.

## Notes

- The extension works with price elements that use the `a-card__price` CSS class.
- The exchange rate is entered manually and is not fetched automatically.
- Converted prices are approximate because values are rounded.
- If the page content changes dynamically after conversion, newly loaded prices may need another conversion.

---

# Chrome-расширение Convert Price to USD

Chrome-расширение для конвертации цен автомобилей из KZT в USD на страницах kolesa.kz.

Расширение открывает небольшое popup-окно, где можно ввести текущий курс KZT к USD. После нажатия **Convert** цены на активной странице kolesa.kz заменяются на приблизительные значения в долларах. Кнопка **Reset** возвращает исходные цены.

## Возможности

- Конвертирует видимые цены объявлений kolesa.kz из KZT в USD.
- Позволяет вручную указать курс валюты.
- Возвращает исходные цены без перезагрузки страницы.
- Использует простую структуру Chrome-расширения на Manifest V3.

## Структура проекта

```text
.
├── manifest.json
├── popup.html
├── popup.css
├── popup.js
└── icon.png
```

## Подробная установка в Chrome

Это расширение устанавливается вручную как unpacked extension, то есть расширение, загруженное из локальной папки.

1. Скачайте или клонируйте проект на компьютер.

   Если используете Git:

   ```bash
   git clone <repository-url>
   ```

   Если вы скачали ZIP-архив, сначала распакуйте его.

2. Откройте Google Chrome.

3. В адресной строке откройте:

   ```text
   chrome://extensions
   ```

4. Включите **Developer mode** / **Режим разработчика**.

   Переключатель обычно находится в правом верхнем углу страницы расширений.

5. Нажмите **Load unpacked** / **Загрузить распакованное расширение**.

6. Выберите папку проекта, в которой находится файл `manifest.json`.

   Нужно выбрать корневую папку проекта, а не отдельный файл.

7. После загрузки Chrome должен показать расширение **Convert price to USD** в списке расширений.

8. Откройте страницу объявлений на kolesa.kz.

9. Нажмите на иконку расширений в панели Chrome и закрепите **Convert price to USD**, если хотите быстро открывать его из панели.

10. Нажмите на иконку расширения, введите текущий курс и нажмите **Convert**.

Если после установки вы изменили файлы расширения, вернитесь на `chrome://extensions` и нажмите кнопку перезагрузки на карточке расширения.

## Использование

1. Откройте страницу kolesa.kz с ценами объявлений.
2. Нажмите на иконку расширения в панели Chrome.
3. Введите текущий курс KZT к USD.
4. Нажмите **Convert**.
5. Нажмите **Reset**, чтобы вернуть исходные цены в KZT.

## Примечания

- Расширение работает с элементами цен, у которых есть CSS-класс `a-card__price`.
- Курс валюты вводится вручную и не загружается автоматически.
- Конвертированные цены являются приблизительными, потому что значения округляются.
- Если после конвертации страница динамически подгружает новые объявления, для новых цен может потребоваться повторная конвертация.

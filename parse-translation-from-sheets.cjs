var fs = require('fs');

fetch(`https://sheet.best/api/sheets/4959bc48-afb9-426b-a28b-e4a764af7ce3`).then((res) => res.json()).then(async (data) => {
    const keys = [] // Name spaces
    data.forEach((element) => {
        const key = element.key.slice(0, element.key.indexOf("."))

        if (!keys.includes(key)) {
            keys.push(key)
        }
    });

    function transformData() {
        const result = {
            en: {},
            qq: {},
            qqKir: {},
            ru: {},
            uz: {},
            uzKir: {},
        };

        data.forEach(item => {
            const [section, ...rest] = item.key.split('.');
            const key = rest.join('.');

            if (!result.en[section]) result.en[section] = {};
            if (!result.qq[section]) result.qq[section] = {};
            if (!result.qqKir[section]) result.qqKir[section] = {};
            if (!result.ru[section]) result.ru[section] = {};
            if (!result.uz[section]) result.uz[section] = {};
            if (!result.uzKir[section]) result.uzKir[section] = {};

            result.en[section][key] = item.en || '';
            result.qq[section][key] = item.qq || '';
            result.qqKir[section][key] = item.qqKir || '';
            result.ru[section][key] = item.ru || '';
            result.uz[section][key] = item.uz || '';
            result.uzKir[section][key] = item.uzKir || '';
        });

        keys.forEach((key) => {
            fs.writeFile(`./src/common/locales/en/${key}.json`, JSON.stringify(result.en[key]), {encoding: 'utf8'}, (err) => {
                if (err) console.error(err);
                else console.log(`Файл ${key}.json успешно записан`);
            });
            fs.writeFile(`./src/common/locales/qq/${key}.json`, JSON.stringify(result.qq[key]), {encoding: 'utf8'}, (err) => {
                if (err) console.error(err);
                else console.log(`Файл ${key}.json успешно записан`);
            });
            fs.writeFile(`./src/common/locales/qqKir/${key}.json`, JSON.stringify(result.qqKir[key]), {encoding: 'utf8'}, (err) => {
                if (err) console.error(err);
                else console.log(`Файл ${key}.json успешно записан`);
            });
            fs.writeFile(`./src/common/locales/ru/${key}.json`, JSON.stringify(result.ru[key]), {encoding: 'utf8'}, (err) => {
                if (err) console.error(err);
                else console.log(`Файл ${key}.json успешно записан`);
            });
            
            fs.writeFile(`./src/common/locales/uz/${key}.json`, JSON.stringify(result.uz[key]), {encoding: 'utf8'}, (err) => {
                if (err) console.error(err);
                else console.log(`Файл ${key}.json успешно записан`);
            });
            fs.writeFile(`./src/common/locales/uzKir/${key}.json`, JSON.stringify(result.uzKir[key]), {encoding: 'utf8'}, (err) => {
                if (err) console.error(err);
                else console.log(`Файл ${key}.json успешно записан`);
            });
        })
    }

    transformData();
})
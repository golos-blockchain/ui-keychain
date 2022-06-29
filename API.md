## API для разработчиков

Если вы разработчик Web-приложений на основе GOLOS и хотите реализовать в них авторизацию с помощью KeyChain, то наиболее предпочительный способ это сделать - используя библиотеку `golos-lib-js`.

Она дает возможность поддерживать сразу и Golos KeyChain, и Golos Signer.

На этот счет есть [документация](https://github.com/golos-blockchain/libs/blob/master/golos-lib-js/docs/files/auth.md).

**Если вы используете какую-то альтернативную библиотеку**, а не `golos-lib-js`, то вы можете сделать свою обертку, используя более низкоуровневое API. При установленном расширении оно доступно на каждой странице по имени `window.golosKeychain`. Список всех методов можно увидеть [здесь](public/inpage_keychain.js). Также есть [пример](https://github.com/golos-blockchain/libs/blob/0.9.35/golos-lib-js/src/multiauth/asyncKeychain.js) асинхронного использования. Следует учитывать, что `golosKeychain` не всегда появляется сразу на момент выполнения скриптов страницы. Отличить это от отсутствия установленного расширения вообще можно [таким образом](https://github.com/golos-blockchain/libs/blob/0.9.35/golos-lib-js/src/multiauth/keychain.js#L4), ориентируясь на id script-тега, который расширение встраивает в каждую страницу. 


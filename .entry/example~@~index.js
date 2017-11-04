
require('../example/index.js');

if (module.hot) {
    module.hot.accept('../example/index.js', function () {
        require('../example/index.js')
    })
}
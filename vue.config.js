module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
      ? '/grot-table/'
      : '/',
    configureWebpack: {
        output: {
            library: "GrotTable",
            libraryExport: 'default'
        },
    },
    chainWebpack: config => {
        config.externals({
            jquery: 'jquery',
            'popper.js': 'popper.js',
            bootstrap: 'bootstrap'
        })
    },
    css: {
        extract: false
    }
}

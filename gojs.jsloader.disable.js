module.exports = [
    {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [
            // root
        ],
        query: {
            cacheDirectory: true,
            presets: ['es2015', 'react', 'stage-0'],
            plugins: [
                // 'react-hot-loader/babel',
                'transform-decorators-legacy',
                [
                    'transform-runtime',
                    {
                        'polyfill': false,
                        'regenerator': true
                    }
                ]
            ]
        },
        happy: {id: 'js'}
    },
    {
        test: /\.worker\..?$/,
        loader: 'file-loader'
    },
    {
        test: /\.css$/,
        exclude: [
            /\.mod\.css/,
            /\.use(able)?\.css/,
        ],
        loaders: [
            'style-loader',
            'css-loader?localIdentName=[path][name]__[local]___[hash:base64:5]',
            'autoprefixer?browsers=last 2 version&remove=false'
        ],
        happy: {id: 'css'}
    },

    {
        test: /\.use(able)?\.css$/,
        loaders: [
            'style-loader/useable',
            'css-loader?localIdentName=[path][name]__[local]___[hash:base64:5]',
            'autoprefixer?browsers=last 2 version&remove=false'
        ],
        happy: {id: 'useable-css'}
    },

    {
        test: /\.mod\.css$/,
        loaders: [
            'style-loader',
            'css-loader?modules&localIdentName=[path][name]__[local]___[hash:base64:5]',
            'autoprefixer?browsers=last 2 version&remove=false'
        ],
        happy: {id: 'mod-css'}
    },

    // .less, .mod.less, .useable.less
    {
        test: /\.less$/,
        exclude: [
            /\.mod\.less$/,
            /\.use(able)?\.less$/,
        ],
        loaders: [
            'style-loader',
            'css-loader?localIdentName=[path][name]__[local]___[hash:base64:5]',
            'autoprefixer?browsers=last 2 version&remove=false',
            'less-loader'
        ],
        happy: {id: 'less'}
    },

    {
        test: /\.use(able)?\.less$/,
        loaders: [
            'style-loader/useable',
            'css-loader?localIdentName=[path][name]__[local]___[hash:base64:5]',
            'autoprefixer?browsers=last 2 version&remove=false',
            'less-loader'
        ],
        happy: {id: 'useable-less'}
    },

    {
        test: /\.mod\.less$/,
        loaders: [
            'style-loader',
            'css-loader?modules&localIdentName=[path][name]__[local]___[hash:base64:5]',
            'autoprefixer?browsers=last 2 version&remove=false',
            'less-loader'
        ],
        happy: {id: 'mod-less'}
    },

    // 其他资源
    {
        test: /\.(jpeg|jpg|png|gif)$/,
        loader: 'url-loader?limit=10240'
    },
    {
        test: /\.html$/,
        loader: 'html-loader'
    },
    {
        test: /\.json$/, loader: 'json-loader'
    },
    {
        test: /\.woff(\?.+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'
    },
    {
        test: /\.woff2(\?.+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'
    },
    {
        test: /\.ttf(\?.+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'
    },
    {
        test: /\.eot(\?.+)?$/, loader: 'file-loader'
    },
    {
        test: /\.svg(\?.+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'
    },
    /*
     {
     test: /\.tag$/,
     loaders: ['babel-loader']
     }
     */
]

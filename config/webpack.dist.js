const wpExternals = require( '../helpers/wp-externals' );
const webpackConfig = require( '@lipemat/js-boilerplate/config/webpack.dist' );
const externalsDefault = Object.assign( {}, webpackConfig.externals );

/**
 * We use the core version of React DOM on production builds.
 * For dev builds we use the @hot-loader/react-dom version.
 *
 * @type {string}
 */
externalsDefault[ 'react-dom' ] = 'ReactDOM';

module.exports = {
	externals: {...externalsDefault, ...wpExternals},
};


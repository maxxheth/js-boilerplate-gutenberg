const webpackConfig = require( '@lipemat/js-boilerplate/config/webpack.dev' );
const wpExternals = require( '../helpers/wp-externals' );
const webpack = require( 'webpack' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const externalsDefault = Object.assign( {}, webpackConfig.externals );
const rules = Object.assign( {}, webpackConfig.module.rules );

// @todo Switch to function based return so don't need to require webpack.dist.

/**
 * Gutenberg is loading within FSE and future areas within an iFrame.
 * We must target said iFrame with the generated <style> tags or
 * our styles won't show up in the editor.
 *
 * 1. We must wait for the iframe to load as it's generated via JS.
 *    so we can't simply point `insert` to `[name="editor-canvas"]`.
 * 2. We don't have much to go on except the iframe name :-(.
 *
 * @notice In order for styles to work in FSE when script debug is off
 *         you must register the style for the block using the CSS handle.
 *         ```php
 *          register_block_type( 'lipe-project/master', [
 *              'editor_style' => self::CSS_HANDLE,
 *          ] );
 *          ```
 *
 * @notice style-loader can only target one document at a time so if an iframe
 *         is found, the iframe will receive the styles where outside fields
 *         will not.
 *
 * @link https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#wpdefinedasset
 */
rules[ 2 ].use[ 0 ] = {
	loader: 'style-loader',
	options: {
		insert: styleTag => {
			setTimeout( () => {
				const gutenbergEditor = document.querySelector( 'iframe[name="editor-canvas"]' );
				if ( gutenbergEditor ) {
					gutenbergEditor.contentDocument.head.appendChild( styleTag );
					console.log( '%cStyling within the editor-canvas iframe, outside styles won\'t work when not in production mode.', 'color: red; font-size: medium;' );
				}
			}, 2000 );

			// Default behavior.
			document.querySelector( 'head' ).appendChild( styleTag );
		},
	},
};


module.exports = {
	externals: {...externalsDefault, ...wpExternals},
};

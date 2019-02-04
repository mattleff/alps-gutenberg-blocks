/**
 * BLOCK: Latest Posts
 */

 /**
  * WordPress dependencies
  */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

/**
 * Internal dependencies
 */
import './style.scss';
import edit from './edit';

registerBlockType( 'alps-gutenberg-blocks/latest-posts', {
	title: __( 'Latest Posts' ),
	description: __( 'Display a list of your most recent posts.' ),
	icon: 'megaphone',
	category: 'widgets',
	keywords: [ __( 'recent posts' ) ],
	supports: {
		html: false,
	},

	getEditWrapperProps( attributes ) {
		const { align } = attributes;
		if ( [ 'left', 'center', 'right', 'wide', 'full' ].includes( align ) ) {
			return { 'data-align': align };
		}
	},

	edit,

	save: function() {
    // Rendering in PHP
    return null;
  },
});

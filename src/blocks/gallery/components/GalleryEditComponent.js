/**
 * External Dependencies
 */
const { filter, get } = lodash;

/**
 * WordPress dependencies
 */
import {Component, Fragment} from "@wordpress/element";
import {Button, DropZone, Toolbar, withNotices} from "@wordpress/components";
import {BlockControls, RichText, MediaUpload, MediaPlaceholder} from "@wordpress/block-editor";

import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import '../editor.scss';
import GalleryImage from '../editor-image';

class GalleryEditComponent extends Component {
    constructor() {
        super( ...arguments );

        this.onSelectImage = this.onSelectImage.bind( this );
        this.onSelectImages = this.onSelectImages.bind( this );
        this.onChangeTitle = this.onChangeTitle.bind( this );
        this.onRemoveImage = this.onRemoveImage.bind( this );
        this.setImageAttributes = this.setImageAttributes.bind( this );

        this.state = {
            selectedImage: null,
        };
    }

    onSelectImage( index ) {
        return () => {
            if ( this.state.selectedImage !== index ) {
                this.setState( {
                    selectedImage: index,
                } );
            }
        };
    }

    onRemoveImage( index ) {

        const { images } = this.props.attributes;

        return () => {
            const images = filter( images, ( img, i ) => index !== i );
            this.setState( { selectedImage: null } );
            this.props.setAttributes( {
                images,
                columns: 1,
            } );
        };
    }

    onSelectImages( images ) {
        // WE USE LODASH'S 'GET' TO GO DEEPER TO GET THE PROVIDED LARGE SIZE URL
        let imageData = images.map( ( image ) => ({
            ..._.pick( image, [ 'alt', 'caption', 'id' ] ),
            url: get( image, 'sizes["flex-height--m"].url' )
        }));

        this.props.setAttributes( {
            images: imageData,
        } );
    }

    onChangeTitle( newTitle ) {
        this.props.setAttributes( { title: newTitle } );
    }

    setImageAttributes( index, attributes ) {
        const { attributes: { images }, setAttributes } = this.props;
        if ( ! images[ index ] ) {
            return;
        }
        setAttributes( {
            images: [
                ...images.slice( 0, index ),
                {
                    ...images[ index ],
                    ...attributes,
                },
                ...images.slice( index + 1 ),
            ],
        } );
    }

    componentWillReceiveProps( nextProps ) {
        // Deselect images when deselecting the block
        if ( ! nextProps.isSelected && this.props.isSelected ) {
            this.setState( {
                selectedImage: null,
                captionSelected: false,
            } );
        }
    }

    render() {
        const { attributes, isSelected, className, noticeOperations, noticeUI } = this.props;
        const { images, title } = attributes;

        const controls = (
            <BlockControls>
                { !! images.length && (
                    <Toolbar>
                        <MediaUpload
                            onSelect={ this.onSelectImage }
                            type={"image"}
                            multiple
                            gallery
                            value={ images.map( ( img ) => img.id ) }
                            render={ ( { open } ) => (
                                <Button
                                    className={"components-toolbar__control"}
                                    label={ __( 'Edit Gallery', 'alps-gutenberg-blocks' ) }
                                    icon="edit"
                                    onClick={ open }
                                />
                            ) }
                        />
                    </Toolbar>
                ) }
            </BlockControls>
        );

        if ( images.length === 0 ) {
            console.log( 'render: images === 0' );
            return (
                <Fragment>
                    { controls }
                    <MediaPlaceholder
                        icon="format-gallery"
                        className={ className }
                        labels={ {
                            title: __( 'Gallery', 'alps-gutenberg-blocks' ),
                            name: __( 'images', 'alps-gutenberg-blocks' ),
                        } }
                        onSelect={ this.onSelectImages }
                        accept={"image/*"}
                        type={"image"}
                        gallery
                        multiple
                        notices={ noticeUI }
                        onError={ noticeOperations.createErrorNotice }
                    />
                </Fragment>
            );
        }

        return (
            <Fragment>
                <RichText
                    tagName={"p"}
                    className={ className }
                    value={ title }
                    onChange={ this.onChangeTitle }
                    placeholder={ __('Enter a gallery title..', 'alps-gutenberg-blocks') }
                />
                { controls }
                { noticeUI }
                <ul className={ className + " wp-block-gallery alps-block-gallery" }>
                    <DropZone />
                    { images.map( ( img, index ) => (
                        <li className={"blocks-gallery-item alps-gallery-item"} key={ img.id || img.url }>
                            <GalleryImage
                                url={ img.url }
                                alt={ img.alt }
                                id={ img.id }
                                isSelected={ isSelected && this.state.selectedImage === index }
                                onRemove={ this.onRemoveImage( index ) }
                                onSelect={ this.onSelectImage( index ) }
                                setAttributes={ ( attrs ) => this.setImageAttributes( index, attrs ) }
                                caption={ img.caption }
                            />
                        </li>
                    ) ) }
                </ul>
                <MediaUpload
                    onSelect={ this.onSelectImages }
                    accept={"image/*"}
                    type={"image"}
                    gallery
                    multiple
                    addToGallery
                    notices={ noticeUI }
                    onError={ noticeOperations.createErrorNotice }

                    value={ images.map( ( img ) => img.id ) }
                    render={ ( { open } ) => (
                        <div onClick={ open }>
                            <Button className="select-images-button is-button is-default is-large">
                                Add / Edit Images
                            </Button>
                        </div>
                    ) }
                />
            </Fragment>
        );
    }
}

export default withNotices( GalleryEditComponent );

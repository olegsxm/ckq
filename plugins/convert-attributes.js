export default function convertDivAttributes(editor ) {
    console.log(editor)
    editor.model.schema.register( 'div', {
        allowWhere: '$block',
        allowContentOf: '$root'
    });

    editor.model.schema.addAttributeCheck( context => {
        if ( context.endsWith( 'div' ) ) {
            return true;
        }
    } );

    editor.conversion.for( 'upcast' ).elementToElement( {
        view: 'div',
        model: ( viewElement, conversionApi  ) => {
            const modelWriter = conversionApi.writer;

            return modelWriter.createElement( 'div', viewElement.getAttributes());
        }
    } );

    editor.conversion.for( 'downcast' ).elementToElement( {
        model: 'div',
        view: 'div'
    } );

    editor.conversion.for( 'downcast' ).add( dispatcher => {
        dispatcher.on( 'attribute', ( evt, data, conversionApi ) => {
            if ( data.item.name != 'div' ) {
                return;
            }

            const viewWriter = conversionApi.writer;
            const viewDiv = conversionApi.mapper.toViewElement( data.item );

            if ( data.attributeNewValue ) {
                viewWriter.setAttribute( data.attributeKey, data.attributeNewValue, viewDiv );
            } else {
                viewWriter.removeAttribute( data.attributeKey, viewDiv );
            }
        } );
    } );
}
import { jsPDF  } from "jspdf";
export const toPDF = async (xmlText, name, svg)=>{
    var imgData = await imageUtil.base64SvgToBase64Png( "data:image/svg+xml;base64," + btoa(svg),1280);
    var doc = new jsPDF()
    doc.setFontSize(20)
    doc.text(35, 25, 'Proceso de cierre de escrutinio provisorio')
    doc.addPage()
    doc.text(20, 20, 'Do you like that?')
    doc.addImage(imgData, 'JPEG', 15, 40, 180, 160)
    doc.setTextColor(150)
    doc.text(20, 30, 'This is light gray.')
    doc.setTextColor(255, 0, 0)
    doc.text(20, 40, 'This is red.')
    doc.save('myPDF.pdf');
}

/**
 * converts a base64 encoded data url SVG image to a PNG image
 * @param originalBase64 data url of svg image
 * @param width target width in pixel of PNG image
 * @param secondTry used internally to prevent endless recursion
 * @return {Promise<unknown>} resolves to png data url of the image
 */
 let imageUtil = {};

imageUtil.base64SvgToBase64Png = function (originalBase64, width, secondTry) {
    return new Promise(resolve => {
        let img = document.createElement('img');
        img.onload = function () {
            if (!secondTry && (img.naturalWidth === 0 || img.naturalHeight === 0)) {
                let svgDoc = base64ToSvgDocument(originalBase64);
                let fixedDoc = fixSvgDocumentFF(svgDoc);
                return imageUtil.base64SvgToBase64Png(svgDocumentToBase64(fixedDoc), width, true).then(result => {
                    resolve(result);
                });
            }
            document.body.appendChild(img);
            let canvas = document.createElement("canvas");
            let ratio = (img.clientWidth / img.clientHeight) || 1;
            document.body.removeChild(img);
            canvas.width = width;
            canvas.height = width / ratio;
            let ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            try {
                let data = canvas.toDataURL('image/png');
                resolve(data);
            } catch (e) {
                resolve(null);
            }
        };
        img.src = originalBase64;
    });
}

//needed because Firefox doesn't correctly handle SVG with size = 0, see https://bugzilla.mozilla.org/show_bug.cgi?id=700533
function fixSvgDocumentFF(svgDocument) {
    try {
        let widthInt = parseInt(svgDocument.documentElement.width.baseVal.value) || 500;
        let heightInt = parseInt(svgDocument.documentElement.height.baseVal.value) || 500;
        svgDocument.documentElement.width.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, widthInt);
        svgDocument.documentElement.height.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, heightInt);
        return svgDocument;
    } catch (e) {
        return svgDocument;
    }
}

function svgDocumentToBase64(svgDocument) {
    try {
        let base64EncodedSVG = btoa(new XMLSerializer().serializeToString(svgDocument));
        return 'data:image/svg+xml;base64,' + base64EncodedSVG;
    } catch (e) {
        return null;
    }
}

function base64ToSvgDocument(base64) {
    let svg = atob(base64.substring(base64.indexOf('base64,') + 7));
    svg = svg.substring(svg.indexOf('<svg'));
    let parser = new DOMParser();
    return parser.parseFromString(svg, "image/svg+xml");
}

// barcodeController.js
const bwipjs = require('bwip-js');

exports.generateBarcode = async (req, res) => {
  try {
    const { text } = req.query;
    if (!text) return res.status(400).send('Barcode text required');
    const png = await bwipjs.toBuffer({
      bcid: 'code128',
      text: text,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: 'center',
    });
    res.setHeader('Content-Type', 'image/png');
    res.send(png);
  } catch (err) {
    res.status(500).send('Barcode generation error');
  }
};

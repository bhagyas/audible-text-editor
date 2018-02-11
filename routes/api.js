const express = require('express');
const router = express.Router();

const http  = require('http');
const url   = require('url');
const shell = require('shelljs');
const files = require('fs');
const path  = require('path');
const util  = require('util');

const voice          = "voice_ucsc_sin_sdn_diphone";
const outputFileName = path.join(__dirname, 'output/voice.wav');

// Generate command
function generateCommand(text, voice, output){
  var command = util.format("echo '%s' | text2wave -o %s -eval '(%s)'", text, output, voice);
  return command;
};

/* GET api listing. */
router.get('/:tts', (req, res) => {
  // Parse GET Data
  var param = req.params.tts;

  // Execute TTS
  var command = generateCommand(param.text, voice, outputFileName);
  console.log("Executing TTS: " + param.text);
  shell.exec(command);

  // Return voice file
  var stat = files.statSync(outputFileName);
  res.writeHead(200, {
    'Content-Type'        : 'audio/wav',
    'Content-Disposition' : 'attachment;filename=voice.wav',
    'Content-Length'      : stat.size
  });

  var readStream = files.createReadStream(outputFileName);
  readStream.pipe(res);
});

module.exports = router;
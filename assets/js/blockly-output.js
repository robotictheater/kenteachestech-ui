/**************************************************************
   CONSOLE LOG
**************************************************************/
Blockly.Blocks['outputlog'] = {
  init: function() {
    this.appendValueInput("dataToLog")
      .setCheck(null)
      .appendField("log to output");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(165);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.JavaScript['outputlog'] = function(block) {
  let dataToLog = Blockly.JavaScript.valueToCode(block, 'dataToLog', Blockly.JavaScript.ORDER_ATOMIC);
  let code = `document.getElementById('${__.js.blocklyOutputTarget}').innerHTML+=${dataToLog};document.getElementById('${__.js.blocklyOutputTarget}').innerHTML+="<br>"; `;
  return code;
};
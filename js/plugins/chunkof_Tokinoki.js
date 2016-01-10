(function() {

  //------------------------------
  // 移動ルートイベント：開始、終了時に勝手にやること追加
  //------------------------------
  // 開始時に「すり抜けON」「速度1/2」にする。
  var Game_Character_forceMoveRoute = Game_Character.prototype.forceMoveRoute;
  Game_Character.prototype.forceMoveRoute = function(moveRoute) {
    Game_Character_forceMoveRoute.call(this,moveRoute);
    this.setThrough(true);
    this.setMoveSpeed(3);
  };

  // 終了時に「速度」「すり抜け設定」を元に戻す。
  var Game_Character_memorizeMoveRoute = Game_Character.prototype.memorizeMoveRoute;
  Game_Character.prototype.memorizeMoveRoute = function() {
    Game_Character_memorizeMoveRoute.call(this);
    this._originalThrough    = this.isThrough();
    this._originalMoveSpeed  = this.moveSpeed();
  };
  var Game_Character_restoreMoveRoute = Game_Character.prototype.restoreMoveRoute;
  Game_Character.prototype.restoreMoveRoute = function() {
    Game_Character_restoreMoveRoute.call(this);
    this.setThrough(this._originalThrough);
    this.setMoveSpeed(this._originalMoveSpeed);
  };

  //------------------------------
  //  ウィンドウ位置：背景種別にあわせて自動設定強
  //------------------------------
  var MESSAGE_BG   = {WIN:0,BLACK:1,TRANS:2};
  var MESSAGE_POS  = {UP:0,MID:1,DOWN:2};
  Game_Message.prototype.setPositionType = function(positionType) {
    if (MESSAGE_BG.WIN == this._background){
      this._positionType = MESSAGE_POS.UP;
    }else{
      this._positionType = MESSAGE_POS.MID;
    }
  };

  //------------------------------
  //  マップ名表示：常に表示
  //------------------------------
  // 見た目の定義
  var textColor = 'rgba(255, 255, 255, 0.8)';
  var bgColor   = 'rgba(50, 50, 10, 0.4)';
  var opacity   = 255;
  // 常に表示(明示的に禁止している場合を除く)
  Window_MapName.prototype.initialize = function() {
    var width = this.windowWidth();
    var height = this.windowHeight();
    var x = SceneManager._boxWidth  - width;
    var y = SceneManager._boxHeight - height+ 16;
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.opacity = 0;
    this.contentsOpacity = ($gameMap.isNameDisplayEnabled()) ? opacity : 0;
    this.changeTextColor(textColor);
    this.refresh();
  };
  Window_MapName.prototype.update = function() {
    var o = ($gameMap.isNameDisplayEnabled()) ? opacity : 0;
    if (o!=this.contentsOpacity){
      this.contentsOpacity = o;
    }
  };
  Window_MapName.prototype.hide = function() {
  };
  // 見た目の調整
  Window_MapName.prototype.drawBackground = function(x, y, width, height) {
    this.contents.fillRect(x, y, width, height, bgColor);
  };
  Window_MapName.prototype.windowWidth = function() {
    return 200;
  };

  //------------------------------
  //  メニュー:必要なものだけにする。
  //------------------------------
  Scene_Menu.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    return this.createCommandWindow();
  };
  Scene_Menu.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
  };
  Scene_Menu.prototype.createCommandWindow = function() {
    this._commandWindow = new Window_MenuCommand(20, 20);
    this._commandWindow.setHandler('save',      this.commandSave.bind(this));
    this._commandWindow.setHandler('options',   this.commandOptions.bind(this));
    this._commandWindow.setHandler('gameEnd',   this.commandGameEnd.bind(this));
    this._commandWindow.setHandler('cancel',    this.popScene.bind(this));
    this.addWindow(this._commandWindow);
  };
  Window_MenuCommand.prototype.makeCommandList = function() {
    this.addSaveCommand();
    this.addOptionsCommand();
    this.addGameEndCommand();

  };
  // 見た目の調整
  Window_MenuCommand.prototype.windowWidth = function() {
    return 200;
  };


  //------------------------------
  //  タイトルメニューの見た目
  //------------------------------
  Window_TitleCommand.prototype.updatePlacement = function() {
    this.x = (Graphics.boxWidth - this.width) / 2;
    this.y = Graphics.boxHeight - this.height - 36;
  };
  Window_TitleCommand.prototype.windowWidth = function() {
    return 180;
  };
  Window_TitleCommand.prototype.standardFontSize = function() {
    return 26;
  };

  //------------------------------
  //  オプションメニュー：必要なもののみ。
  //------------------------------
  Window_Options.prototype.addGeneralOptions = function() {
    this.addCommand(TextManager.alwaysDash, 'alwaysDash');
  };
  Window_Options.prototype.addVolumeOptions = function() {
    this.addCommand(TextManager.bgmVolume, 'bgmVolume');
    this.addCommand(TextManager.seVolume, 'seVolume');
  };

  //------------------------------
  // Pre Load
  //------------------------------
  TDDP.bootPreloadImages = {
    picture: [
      "light",
      "light2"
    ]
  }
})();


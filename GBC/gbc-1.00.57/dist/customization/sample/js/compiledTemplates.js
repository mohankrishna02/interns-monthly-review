var gbcTemplates = {};

gbcTemplates["LeafLayoutMeasureElement"] = "<span class=\"gbc_dataContentMeasure\" aria-hidden></span>";

gbcTemplates["MenuWidget"] = "<div role=\"menu\">\n" +
   "  <div class=\"gbc_MenuWidgetTitle\">\n" +
   "    <div class=\"gbc_MenuWidgetText\"></div>\n" +
   "  </div>\n" +
   "  <div class=\"gbc_MenuWidgetScrollContainer\">\n" +
   "    <div class=\"containerElement\"></div>\n" +
   "  </div>\n" +
   "</div>";

gbcTemplates["StartMenuCommandWidget"] = "<div class=\"mt-as-link\" role=\"menuitem\">\n" +
   "  <span class=\"gbc_startMenuCommandText\"></span>\n" +
   "</div>";

gbcTemplates["StartMenuGroupWidget"] = "<div>\n" +
   "  <div class=\"gbc_startMenuGroupTitle mt-as-link\">\n" +
   "    <div class=\"gbc_startMenuGroupTitleText\"></div>\n" +
   "  </div>\n" +
   "  <div class=\"containerElement\"></div>\n" +
   "</div>";

gbcTemplates["StartMenuSeparatorWidget"] = "<div class=\"divider\" role=\"separator\"></div>";

gbcTemplates["StartMenuWidget"] = "<div role=\"menu\">\n" +
   "  <div class=\"gbc_StartMenuText\"></div>\n" +
   "  <div class=\"wrapper\">\n" +
   "    <div class=\"containerElement\"></div>\n" +
   "  </div>\n" +
   "</div>";

gbcTemplates["ToolBarItemWidget"] = "<div class=\"mt-item\" role=\"menuitem\">\n" +
   "  <div class=\"gbc_imageContainer\"></div>\n" +
   "  <span></span>\n" +
   "</div>";

gbcTemplates["ToolBarSeparatorWidget"] = "<div class=\"mt-separator\" role=\"separator\">\n" +
   "  <div class=\"mt-line-v\"></div>\n" +
   "</div>";

gbcTemplates["ToolBarWidget"] = "<div class=\"mt-tab-titles-bar\" role=\"toolbar\" aria-orientation=\"horizontal\">\n" +
   "  <div class=\"mt-tab-titles\">\n" +
   "    <div class=\"mt-tab-titles-container containerElement\"></div>\n" +
   "  </div>\n" +
   "  <div class=\"mt-tab-flow\"></div>\n" +
   "</div>";

gbcTemplates["TopMenuCommandWidget"] = "<div role=\"menuitem\">\n" +
   "  <span class=\"anchor\"></span>\n" +
   "  <span class=\"gbc-label-comment-container\"></span>\n" +
   "</div>";

gbcTemplates["TopMenuGroupWidget"] = "<div class=\"containerElement\">\n" +
   "  <span class=\"topMenuGroupText\"></span>\n" +
   "  <span class=\"topMenuGroupCaret\"></span>\n" +
   "</div>";

gbcTemplates["TopMenuSeparatorWidget"] = "<div class=\"divider\" role=\"separator\" aria-orientation=\"horizontal\"></div>";

gbcTemplates["TopMenuWidget"] = "<ul class=\"containerElement\" role=\"menu\"></ul>";

gbcTemplates["ApplicationWidget"] = "<div class=\"g_measuring\" tabindex=\"0\">\n" +
   "  <div class=\"loading-bar\"></div>\n" +
   "  <div class=\"containerElement\"></div>\n" +
   "</div>";

gbcTemplates["SessionEndRedirectWidget"] = "<div data-i18n=\"gwc.app.ending.redirect\">Your session has ended. You will be automatically redirected in a few seconds.</div>";

gbcTemplates["SessionEndWidget"] = "<div>\n" +
   "  <div class=\"chromeBarContainer\"></div>\n" +
   "  <div class=\"mt-card\">\n" +
   "    <div class=\"mt-card-richhead\">\n" +
   "          <span class=\"mt-card-header-text\">\n" +
   "          </span>\n" +
   "      <span class=\"mt-card-header-rightpic\"><i class=\"zmdi zmdi-close-circle\"></i></span>\n" +
   "    </div>\n" +
   "    <div class=\"mt-card-body\">\n" +
   "      <div class=\"message hidden\"></div>\n" +
   "      <p class=\"session hidden\">\n" +
   "        <span class=\"sessionTitle\" data-i18n=\"gwc.app.ending.session\">Session ID</span> :\n" +
   "        <span class=\"sessionID\"></span>\n" +
   "      </p>\n" +
   "      <ul class=\"mt-actions\">\n" +
   "        <li class=\"mt-action vmLink from-session hidden\">\n" +
   "          <a target=\"_blank\" title=\"Virtual Machine log\">\n" +
   "            <i class=\"zmdi zmdi-file-document\"></i> <span data-i18n=\"gwc.app.logs.vm\">Get the VM Log</span>\n" +
   "          </a>\n" +
   "        </li>\n" +
   "        <li class=\"mt-action uaLink from-session hidden\">\n" +
   "          <a target=\"_blank\" title=\"Proxy log\">\n" +
   "            <i class=\"zmdi zmdi-file-document\"></i> <span data-i18n=\"gwc.app.logs.proxy\">Get the Proxy Log</span>\n" +
   "          </a>\n" +
   "        </li>\n" +
   "        <li class=\"mt-action auiLink mt-as-link from-session_ hidden\">\n" +
   "          <a title=\"Aui log\">\n" +
   "            <i class=\"zmdi zmdi-file-document\"></i> <span>Get the AUI log</span>\n" +
   "          </a>\n" +
   "        </li>\n" +
   "        <li class=\"mt-action gbcLogLink hidden\">\n" +
   "          <a target=\"_blank\" title=\"GBC log\">\n" +
   "            <i class=\"zmdi zmdi-file-document\"></i> <span data-i18n=\"gwc.app.logs.gbc\">Get the GBC Log</span>\n" +
   "          </a>\n" +
   "        </li>\n" +
   "        <li class=\"mt-action restartApp from-ua hidden\">\n" +
   "          <a title=\"Restart the app\">\n" +
   "            <i class=\"zmdi zmdi-repeat\"></i> <span data-i18n=\"gwc.app.restart\">Restart the same application</span>\n" +
   "          </a>\n" +
   "        </li>\n" +
   "      </ul>\n" +
   "    </div>\n" +
   "    <div class=\"mt-card-actions\">\n" +
   "      <button type=\"button\" class=\"mt-button mt-button-flat closeApplicationEnd\" aria-label=\"Close\">\n" +
   "        <span aria-hidden=\"true\" data-i18n=\"gwc.app.close\">CLOSE</span>\n" +
   "      </button>\n" +
   "    </div>\n" +
   "  </div>\n" +
   "</div>";

gbcTemplates["SessionLogPromptWidget"] = "<div>\n" +
   "  <div data-i18n=\"gwc.session.logprompt.logneeded\"></div>\n" +
   "  <button type=\"button\" class=\"mt-button\" aria-label=\"Log\">\n" +
   "    <span aria-hidden=\"true\" data-i18n=\"gwc.session.logprompt.relog\">login</span>\n" +
   "  </button>\n" +
   "</div>";

gbcTemplates["SessionWaitingEndWidget"] = "<div role=\"timer\">\n" +
   "  <div class=\"mt-card\">\n" +
   "    <div class=\"mt-card-richhead\">\n" +
   "          <span class=\"mt-card-header-text\" data-i18n=\"gwc.session.waitingend.title\">\n" +
   "          </span>\n" +
   "      <span class=\"mt-card-header-pic\"><img src=\"\" alt=\"Loading wheel\"/></span>\n" +
   "    </div>\n" +
   "    <div class=\"mt-card-body\">\n" +
   "      <div class=\"message\" data-i18n=\"gwc.session.waitingend.message\"></div>\n" +
   "    </div>\n" +
   "  </div>\n" +
   "</div>";

gbcTemplates["SessionWidget"] = "<div role=\"application\">\n" +
   "  <div class=\"containerElement\"></div>\n" +
   "</div>";

gbcTemplates["WaitingWidget"] = "<div>\n" +
   "  <div class=\"gbc_WaitingWidget_outer_content\" role=\"status\">\n" +
   "    <div class=\"gbc_WaitingWidget_inner_content\">\n" +
   "      <span data-i18n=\"gwc.app.waiting\">Waiting for connection</span>\n" +
   "      <div class=\"gbc_WaitingWidget_bars\">\n" +
   "        <div class=\"gbc_WaitingWidget_bar gbc_WaitingWidget_bar1\"></div>\n" +
   "        <div class=\"gbc_WaitingWidget_bar gbc_WaitingWidget_bar2\"></div>\n" +
   "        <div class=\"gbc_WaitingWidget_bar gbc_WaitingWidget_bar3\"></div>\n" +
   "        <div class=\"gbc_WaitingWidget_bar gbc_WaitingWidget_bar4\"></div>\n" +
   "        <div class=\"gbc_WaitingWidget_bar gbc_WaitingWidget_bar5\"></div>\n" +
   "      </div>\n" +
   "    </div>\n" +
   "  </div>\n" +
   "</div>";

gbcTemplates["ApplicationHostWidget"] = "<div>\n" +
   "  <div class=\"mt-centralcontainer\">\n" +
   "    <div class=\"mt-centralcontainer-content containerElement\">\n" +
   "    </div>\n" +
   "  </div>\n" +
   "</div>";

gbcTemplates["ApplicationInformationWidget"] = "<div class=\"applicationInformation\">\n" +
   "  <label>Current application UA url : <input type=\"text\" readonly=\"readonly\" class=\"applicationUAR\"/></label>\n" +
   "</div>";

gbcTemplates["ChromeBarItemWidget"] = "<div tabindex=\"0\">\n" +
   "  <div class=\"gbc_imageContainer\"></div>\n" +
   "  <span class=\"text\"></span>\n" +
   "</div>";

gbcTemplates["ChromeBarWidget"] = "<header class=\"mt-toolbar noselect\">\n" +
   "  <div class=\"mt-sidebar-toggle mt-action mt-as-link\">\n" +
   "    <i class=\"zmdi zmdi-menu zmdi-hc-2x\"></i>\n" +
   "  </div>\n" +
   "  <div class=\"mt-toolbar-title\">\n" +
   "    <span class=\"currentDisplayedWindow\"></span>\n" +
   "  </div>\n" +
   "\n" +
   "  <div class=\"containerElement\">  </div>\n" +
   "\n" +
   "  <div class=\"mt-sidebar-action-toggle hidden\">\n" +
   "    <i class=\"zmdi zmdi-dots-vertical zmdi-hc-2x\"></i>\n" +
   "  </div>\n" +
   "</header>";

gbcTemplates["ChromeRightBarWidget"] = "<div>\n" +
   "  <div class=\"containerElement\"></div>\n" +
   "  <div class=\"chromeAppHostMenu\"></div>\n" +
   "</div>";

gbcTemplates["LogLevelSelectorWidget"] = "<div>\n" +
   "  <div data-loglevel=\"none\" class=\"none\">none</div>\n" +
   "  <div data-loglevel=\"error\" class=\"error\">error</div>\n" +
   "  <div data-loglevel=\"warn\" class=\"warn\">warn</div>\n" +
   "  <div data-loglevel=\"info\" class=\"info\">info</div>\n" +
   "  <div data-loglevel=\"log\" class=\"log\">log</div>\n" +
   "  <div data-loglevel=\"debug\" class=\"debug\">debug</div>\n" +
   "</div>";

gbcTemplates["LogInfoWidget"] = "<div>\n" +
   "  <div class=\"panel panel-primary loginfo-gbc\">\n" +
   "    <div class=\"panel-heading\">GBC</div>\n" +
   "    <div class=\"panel-body\"></div>\n" +
   "  </div>\n" +
   "  <div class=\"panel panel-primary loginfo-browser\">\n" +
   "    <div class=\"panel-heading\" data-i18n=\"gwc.logPlayer.logInfo.headers.browser\">BROWSER</div>\n" +
   "    <div class=\"panel-body\"></div>\n" +
   "  </div>\n" +
   "  <div class=\"panel panel-primary loginfo-theme\">\n" +
   "    <div class=\"panel-heading\" data-i18n=\"gwc.logPlayer.logInfo.headers.themeVariables\">THEME VARIABLES</div>\n" +
   "    <div class=\"panel-body\"></div>\n" +
   "  </div>\n" +
   "  <div class=\"panel panel-primary loginfo-settings\">\n" +
   "    <div class=\"panel-heading\" data-i18n=\"gwc.logPlayer.logInfo.header.storedSettings\">STORED SETTINGS</div>\n" +
   "    <div class=\"panel-body\"></div>\n" +
   "  </div>\n" +
   "</div>";

gbcTemplates["LogPlayerWidget"] = "<div>\n" +
   "  <header class=\"logplayer-topbar\">\n" +
   "    <span class=\"logplayer-cursor hidden\"></span>\n" +
   "    <div class=\"logplayer-item\">\n" +
   "      <span class=\"logfile\" data-i18n=\"gwc.logPlayer.topBar.logFile\">Log File</span>\n" +
   "      <label class=\"logplayer-fileinput mt-button\">\n" +
   "        <div><div data-i18n=\"gwc.file.upload.select\"></div> <i class=\"zmdi zmdi-upload\"></i></div>\n" +
   "        <input type=\"file\" class=\"mt-field\">\n" +
   "      </label>\n" +
   "    </div>\n" +
   "\n" +
   "    <div class=\"logplayer-separator\"></div>\n" +
   "\n" +
   "    <div class=\"logplayer-item\">\n" +
   "      <span data-i18n=\"gwc.logPlayer.topBar.controls\">Controls</span>\n" +
   "      <div>\n" +
   "        <button class=\"logplayer-reset mt-button\" title=\"Reset\"><i class=\"zmdi zmdi-backup-restore\"></i></button>\n" +
   "        <button class=\"logplayer-step mt-button\" title=\"Next step\"><i class=\"zmdi zmdi-debug-step-over\"></i></button>\n" +
   "        <button class=\"logplayer-play mt-button mt-button-green\" title=\"Play\"><i class=\"zmdi zmdi-play\"></i></button>\n" +
   "        <button class=\"logplayer-pause mt-button\" title=\"Pause\"><i class=\"zmdi zmdi-pause\"></i></button>\n" +
   "      </div>\n" +
   "    </div>\n" +
   "    <div class=\"logplayer-item\">\n" +
   "      <span data-i18n=\"gwc.logPlayer.topBar.gotoStep\">Go to Step</span>\n" +
   "      <div>\n" +
   "        <input type=\"number\" class=\"logplayer-forward-count mt-field\" value=\"5\">\n" +
   "        <button class=\"logplayer-forward mt-button\" title=\"Forward\"><i class=\"zmdi zmdi-fast-forward\"></i></button>\n" +
   "      </div>\n" +
   "    </div>\n" +
   "\n" +
   "    <div class=\"logplayer-separator\"></div>\n" +
   "\n" +
   "    <div class=\"logplayer-item\">\n" +
   "      <span class=\"logplayer-stats\"></span>\n" +
   "    </div>\n" +
   "\n" +
   "    <div class=\"logplayer-separator\"></div>\n" +
   "\n" +
   "    <div class=\"logplayer-item\">\n" +
   "      <label><span data-i18n=\"gwc.logPlayer.topBar.delay\">Delay</span>\n" +
   "        <input type=\"number\" class=\"logplayer-delay mt-field\">\n" +
   "      </label>\n" +
   "    </div>\n" +
   "    <div class=\"logplayer-item\">\n" +
   "      <div class=\"logplayer-delayfromlog\"></div>\n" +
   "    </div>\n" +
   "\n" +
   "    <div class=\"logplayer-separator\"></div>\n" +
   "\n" +
   "    <div class=\"logplayer-item\">\n" +
   "      <div class=\"logplayer-showHelpers\"></div>\n" +
   "    </div>\n" +
   "\n" +
   "    <div class=\"logplayer-separator\"></div>\n" +
   "\n" +
   "    <div class=\"logplayer-item\">\n" +
   "      <div class=\"logplayer-userInteraction\"></div>\n" +
   "    </div>\n" +
   "\n" +
   "    <div class=\"logplayer-item\">\n" +
   "      <div class=\"logplayer-keypressed hidden\">\n" +
   "        <div class=\"key key-modifier hidden\">\n" +
   "          <span></span>\n" +
   "        </div>\n" +
   "        <div class=\"key key-letter\">\n" +
   "          <span></span>\n" +
   "        </div>\n" +
   "      </div>\n" +
   "      <div class=\"logplayer-mousepressed hidden\">\n" +
   "        <div class=\"key key-left\">\n" +
   "          <span>❰</span>\n" +
   "        </div>\n" +
   "        <div class=\"key key-wheel\">\n" +
   "          <span></span>\n" +
   "        </div>\n" +
   "        <div class=\"key key-right\">\n" +
   "          <span>❱</span>\n" +
   "        </div>\n" +
   "      </div>\n" +
   "    </div>\n" +
   "  </header>\n" +
   "  \n" +
   "  <div class=\"containerElement\"></div>\n" +
   "</div>";

gbcTemplates["LogRecorderWidget"] = "<div>\n" +
   "  <span>•</span> <i data-i18n=\"gwc.logPlayer.recordingLog\"></i>...\n" +
   "</div>";

gbcTemplates["LogTypesSelectorWidget"] = "<div>\n" +
   "</div>";

gbcTemplates["MainContainerWidget"] = "<div class=\"containerElement\"></div>";

gbcTemplates["ApplicationHostMenuAboutWidget"] = "<li title=\"GBC\">\n" +
   "  <a class=\"mt-action\"><i class=\"zmdi zmdi-information zmdi-hc-lg\" title=\"Application information\"></i></a>\n" +
   "</li>";

gbcTemplates["ApplicationHostMenuBookmarkWidget"] = "<li>\n" +
   "  <a class=\"mt-action\"><i class=\"zmdi zmdi-bookmark-outline zmdi-hc-lg\" title=\"Bookmark\"></i></a>\n" +
   "</li>";

gbcTemplates["ApplicationHostMenuDebugWidget"] = "<li>\n" +
   "  <a class=\"mt-action\"><i class=\"zmdi zmdi-memory zmdi-hc-lg\" title=\"Debug tools\"></i></a>\n" +
   "</li>";

gbcTemplates["ApplicationHostMenuProxyLogWidget"] = "<li>\n" +
   "  <a class=\"mt-action\"><i class=\"zmdi zmdi-file-document zmdi-hc-lg\" title=\"Proxy Logs\"></i>\n" +
   "    <small>PXY</small>\n" +
   "  </a>\n" +
   "</li>";

gbcTemplates["ApplicationHostMenuRunInGdcWidget"] = "<li>\n" +
   "  <a class=\"mt-action\"><i class=\"zmdi zmdi-play zmdi-hc-lg\" title=\"Run in GDC\"></i>\n" +
   "    <small>GDC</small>\n" +
   "  </a>\n" +
   "</li>";

gbcTemplates["ApplicationHostMenuRunInGwcWidget"] = "<li>\n" +
   "  <a class=\"mt-action\"><i class=\"zmdi zmdi-play zmdi-hc-lg\" title=\"Run in GWC-HTML5\"></i>\n" +
   "    <small>GWC</small>\n" +
   "  </a>\n" +
   "</li>";

gbcTemplates["ApplicationHostMenuRuntimeWidget"] = "<li>\n" +
   "  <a class=\"mt-action\"><i class=\"zmdi zmdi-swap-vertical zmdi-hc-lg\" title=\"RunTime\"></i></a>\n" +
   "</li>";

gbcTemplates["ApplicationHostMenuSettingsWidget"] = "<li>\n" +
   "  <a class=\"mt-action\"><i class=\"zmdi zmdi-settings zmdi-hc-lg\" title=\"Settings\"></i></a>\n" +
   "\n" +
   "</li>";

gbcTemplates["ApplicationHostMenuUploadsWidget"] = "<li>\n" +
   "  <a class=\"mt-action\"><i class=\"zmdi zmdi-upload zmdi-hc-lg\" title=\"Uploads\"></i></a>\n" +
   "</li>";

gbcTemplates["ApplicationHostMenuVmLogWidget"] = "<li>\n" +
   "  <a class=\"mt-action\"><i class=\"zmdi zmdi-file-document zmdi-hc-lg\" title=\"VM Logs\"></i>\n" +
   "    <small>DVM</small>\n" +
   "  </a>\n" +
   "</li>";

gbcTemplates["ApplicationHostMenuWidget"] = "<header class=\"mt-toolbar noselect\">\n" +
   "  <div class=\"mt-sidebar-toggle mt-action mt-as-link\">\n" +
   "    <i class=\"zmdi zmdi-menu zmdi-hc-2x\"></i>\n" +
   "  </div>\n" +
   "  <div class=\"mt-toolbar-title\">\n" +
   "    <span class=\"currentDisplayedWindow\"></span>\n" +
   "  </div>\n" +
   "  <ul class=\"mt-actions containerElement\">\n" +
   "  </ul>\n" +
   "  <div class=\"mt-sidebar-action-toggle mt-as-link\">\n" +
   "    <i class=\"zmdi zmdi-dots-vertical zmdi-hc-2x\"></i>\n" +
   "  </div>\n" +
   "  <div class=\"mt-sidebar-backdrop\"></div>\n" +
   "</header>";

gbcTemplates["ApplicationHostMenuWindowCloseWidget"] = "<li class=\"gbc_Invisible\">\n" +
   "  <a class=\"mt-action\"><i class=\"zmdi zmdi-close-circle zmdi-hc-lg\" title=\"Close window\"></i></a>\n" +
   "</li>";

gbcTemplates["MonitorDebugLayoutInfoWidget"] = "<div>\n" +
   "  <h5 class=\"value_layoutEngineName\"></h5>\n" +
   "  <h6><span class=\"value_invalidated_measure\"></span>|<span class=\"value_invalidated_allocatedspace\"></span></h6>\n" +
   "  <div class=\"aui\">\n" +
   "    <table>\n" +
   "      <tr class=\"auititle\">\n" +
   "        <td>grid</td>\n" +
   "        <td></td>\n" +
   "      </tr>\n" +
   "      <tr>\n" +
   "        <td>X</td>\n" +
   "        <td class=\"value_posX\"></td>\n" +
   "      </tr>\n" +
   "      <tr>\n" +
   "        <td>Y</td>\n" +
   "        <td class=\"value_posY\"></td>\n" +
   "      </tr>\n" +
   "      <tr>\n" +
   "        <td>Width</td>\n" +
   "        <td class=\"value_gridWidth\"></td>\n" +
   "      </tr>\n" +
   "      <tr>\n" +
   "        <td>Height</td>\n" +
   "        <td class=\"value_gridHeight\"></td>\n" +
   "      </tr>\n" +
   "      <tr class=\"auititle\">\n" +
   "        <td>preferred</td>\n" +
   "        <td></td>\n" +
   "      </tr>\n" +
   "      <tr>\n" +
   "        <td>width</td>\n" +
   "        <td class=\"value_width\"></td>\n" +
   "      </tr>\n" +
   "      <tr>\n" +
   "        <td>height</td>\n" +
   "        <td class=\"value_height\"></td>\n" +
   "      </tr>\n" +
   "    </table>\n" +
   "  </div>\n" +
   "  <div class=\"measures\">\n" +
   "    <table>\n" +
   "      <tr class=\"auititle\">\n" +
   "        <td></td>\n" +
   "        <td>has value</td>\n" +
   "        <td>width</td>\n" +
   "        <td>height</td>\n" +
   "      </tr>\n" +
   "      <tr>\n" +
   "        <td>Measured</td>\n" +
   "        <td class=\"value_measured_hasSize\"></td>\n" +
   "        <td class=\"value_measured_width\"></td>\n" +
   "        <td class=\"value_measured_height\"></td>\n" +
   "      </tr>\n" +
   "      <tr>\n" +
   "        <td>Minimal</td>\n" +
   "        <td class=\"value_minimal_hasSize\"></td>\n" +
   "        <td class=\"value_minimal_width\"></td>\n" +
   "        <td class=\"value_minimal_height\"></td>\n" +
   "      </tr>\n" +
   "      <tr>\n" +
   "        <td>Maximal</td>\n" +
   "        <td class=\"value_maximal_hasSize\"></td>\n" +
   "        <td class=\"value_maximal_width\"></td>\n" +
   "        <td class=\"value_maximal_height\"></td>\n" +
   "      </tr>\n" +
   "      <tr>\n" +
   "        <td>Available</td>\n" +
   "        <td class=\"value_available_hasSize\"></td>\n" +
   "        <td class=\"value_available_width\"></td>\n" +
   "        <td class=\"value_available_height\"></td>\n" +
   "      </tr>\n" +
   "      <tr>\n" +
   "        <td>Allocated</td>\n" +
   "        <td class=\"value_allocated_hasSize\"></td>\n" +
   "        <td class=\"value_allocated_width\"></td>\n" +
   "        <td class=\"value_allocated_height\"></td>\n" +
   "      </tr>\n" +
   "      <tr>\n" +
   "        <td>Preferred</td>\n" +
   "        <td class=\"value_preferred_hasSize\"></td>\n" +
   "        <td class=\"value_preferred_width\"></td>\n" +
   "        <td class=\"value_preferred_height\"></td>\n" +
   "      </tr>\n" +
   "      <tr>\n" +
   "        <td>Decorating</td>\n" +
   "        <td class=\"value_decorating_hasSize\"></td>\n" +
   "        <td class=\"value_decorating_width\"></td>\n" +
   "        <td class=\"value_decorating_height\"></td>\n" +
   "      </tr>\n" +
   "      <tr>\n" +
   "        <td>Decorating offset</td>\n" +
   "        <td class=\"value_decoratingoffset_hasSize\"></td>\n" +
   "        <td class=\"value_decoratingoffset_width\"></td>\n" +
   "        <td class=\"value_decoratingoffset_height\"></td>\n" +
   "      </tr>\n" +
   "    </table>\n" +
   "  </div>\n" +
   "  <div class=\"stretch\">\n" +
   "    <table>\n" +
   "      <tr class=\"auititle\">\n" +
   "        <td>stretch</td>\n" +
   "        <td></td>\n" +
   "      </tr>\n" +
   "      <tr>\n" +
   "        <td>X</td>\n" +
   "        <td class=\"value_stretch_x\"></td>\n" +
   "      </tr>\n" +
   "      <tr>\n" +
   "        <td>Y</td>\n" +
   "        <td class=\"value_stretch_y\"></td>\n" +
   "      </tr>\n" +
   "      <tr class=\"auititle\">\n" +
   "        <td>children</td>\n" +
   "        <td></td>\n" +
   "      </tr>\n" +
   "      <tr>\n" +
   "        <td>X</td>\n" +
   "        <td class=\"value_stretch_children_x\"></td>\n" +
   "      </tr>\n" +
   "      <tr>\n" +
   "        <td>Y</td>\n" +
   "        <td class=\"value_stretch_children_y\"></td>\n" +
   "      </tr>\n" +
   "    </table>\n" +
   "  </div>\n" +
   "</div>";

gbcTemplates["MonitorDebugNodeInfoWidget"] = "<div>\n" +
   "  <table>\n" +
   "    <thead>\n" +
   "    <tr>\n" +
   "      <td colspan=\"2\">Property</td>\n" +
   "      <td>Value</td>\n" +
   "      <td>Value with '_'</td>\n" +
   "      <td>Default value</td>\n" +
   "    </tr>\n" +
   "    </thead>\n" +
   "    <tbody></tbody>\n" +
   "  </table>\n" +
   "  <div class=\"extended\"></div>\n" +
   "</div>";

gbcTemplates["MonitorDebugTreeItemWidget"] = "<li>\n" +
   "  <div class=\"description\">\n" +
   "    <span class=\"icon\"></span>\n" +
   "    <span class=\"label\"></span>\n" +
   "    <span class=\"idRef\"></span>\n" +
   "  </div>\n" +
   "  <ul class=\"containerElement\"></ul>\n" +
   "</li>";

gbcTemplates["MonitorDebugTreeWidget"] = "<div>\n" +
   "  <div class=\"part\">\n" +
   "    <div>\n" +
   "      <ul class=\"containerElement\"></ul>\n" +
   "    </div>\n" +
   "  </div>\n" +
   "  <div class=\"part\">\n" +
   "    <div class=\"nodeDebug\"></div>\n" +
   "    <div class=\"layoutInfo\"></div>\n" +
   "  </div>\n" +
   "</div>";

gbcTemplates["MonitorWidget"] = "<div class=\"containerElement\">\n" +
   "  <div class=\"headerSettings\">\n" +
   "    <label><input id=\"debugGrid\" type=\"checkbox\"> Enable persistant debug grid</label>\n" +
   "  </div>\n" +
   "</div>";

gbcTemplates["ProductInformationWidget"] = "<div>\n" +
   "  <div class=\"flexible_host_stretch_row\">\n" +
   "    <img class=\"logo field_logo\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\" alt=\"Genero Logo\"/>\n" +
   "    <div class=\"versionInfo flexible_guest_stretch\">\n" +
   "      <p class=\"flexible_host_stretch_row\">\n" +
   "        <span class=\"label\">Version</span>&nbsp;\n" +
   "        <span class=\"value field_version\"></span>\n" +
   "      </p>\n" +
   "      <p class=\"flexible_host_stretch_row\">\n" +
   "        <small>\n" +
   "          <span class=\"label\">Build</span>&nbsp;\n" +
   "          <span class=\"value field_build\"></span>\n" +
   "        </small>\n" +
   "      </p>\n" +
   "      <p class=\"flexible_host_stretch_row\">\n" +
   "        <small><span class=\"value field_tag\"></span></small>\n" +
   "      </p>\n" +
   "    </div>\n" +
   "  </div>\n" +
   "  <div class=\"copyright\">\n" +
   "    <small>\n" +
   "      Property of Four Js<sup>*</sup><br>\n" +
   "      &#169; Copyright Four Js 2018. All Rights Reserved.<br>\n" +
   "      * Trademark of Four Js Development Tools Europe Ltd in the United States and elsewhere\n" +
   "    </small>\n" +
   "  </div>\n" +
   "</div>";

gbcTemplates["SettingsWidget"] = "<div class=\"containerElement\">\n" +
   "    <div class=\"settingsTopic\">\n" +
   "        <div class=\"settingTitle\" data-i18n=\"gwc.storedSettings.uiLanguage\">Interface language</div>\n" +
   "        <div class=\"settingContent lngSettings\"></div>\n" +
   "    </div>\n" +
   "    <div class=\"settingsTopic\">\n" +
   "        <div class=\"settingTitle\" data-i18n=\"gwc.storedSettings.theme\">Interface theme</div>\n" +
   "        <div class=\"settingContent themeSettings\"></div>\n" +
   "    </div>\n" +
   "    <div class=\"settingsTopic\">\n" +
   "        <div class=\"settingTitle\" data-i18n=\"gwc.storedSettings.settings\">Stored Settings</div>\n" +
   "        <div class=\"settingContent storedSettings\"></div>\n" +
   "        <div class=\"message hidden\">\n" +
   "            <div class=\"settingTitle\" data-i18n=\"gwc.storedSettings.message\"></div>\n" +
   "            <span data-i18n=\"gwc.storedSettings.messageContent\"></span> : <i>QuotaExceededError</i>\n" +
   "        </div>\n" +
   "    </div>\n" +
   "    <div class=\"settingsTopic debugTopic hidden\">\n" +
   "        <div class=\"settingTitle\">Debug & QA</div>\n" +
   "        <div class=\"settingContent\">\n" +
   "            <div class=\"settingSubContent typeahead\"><span class=\"settingSubTitle\">Typeahead minimal duration (ms)</span></div>\n" +
   "            <div class=\"settingSubContent loglevel\"><span class=\"settingSubTitle\">Log level</span></div>\n" +
   "            <div class=\"settingSubContent logtypes\"><span class=\"settingSubTitle\">Log types</span></div>\n" +
   "        </div>\n" +
   "    </div>\n" +
   "</div>";

gbcTemplates["ApplicationHostSidebarBackdropWidget"] = "<div class=\"mt-sidebar-backdrop\"></div>";

gbcTemplates["ApplicationHostSidebarWidget"] = "<div class=\"mt-sidebar noselect\">\n" +
   "  <div class=\"mt-sidebar-content\">\n" +
   "    <div class=\"mt-sidebar-title\">\n" +
   "      <div class=\"mt-sidebar-toggle mt-action mt-as-link\">\n" +
   "        <i class=\"zmdi zmdi-menu zmdi-hc-2x\"></i>\n" +
   "      </div>\n" +
   "      <div class=\"mt-sidebar-title-text\" data-i18n=\"gwc.main.sidebar.title\">My Genero applications</div>\n" +
   "    </div>\n" +
   "    <div class=\"mt-content\">\n" +
   "      <div class=\"containerElement\"></div>\n" +
   "    </div>\n" +
   "  </div>\n" +
   "  <div class=\"resizer\">\n" +
   "    <div class=\"firefox_placekeeper\">.</div>\n" +
   "  </div>\n" +
   "</div>";

gbcTemplates["SessionSidebarApplicationItemWidget"] = "<div role=\"menuitem\">\n" +
   "  <div>\n" +
   "    <span class=\"applicationIcon\"></span>\n" +
   "    <span class=\"applicationName\"></span>\n" +
   "  </div>\n" +
   "  <ul class=\"mt-actions containerElement\"></ul>\n" +
   "</div>";

gbcTemplates["SessionSidebarWidget"] = "<ul class=\"mt-actions containerElement\" role=\"menu\"></ul>";

gbcTemplates["SessionSidebarWindowItemWidget"] = "<div role=\"menuitem\">\n" +
   "  <span class=\"windowIcon\"></span>\n" +
   "  <a tabindex=\"-1\"><span class=\"windowName\"></span></a>\n" +
   "</div>";

gbcTemplates["ApplicationLauncherBookmarkItemWidget"] = "<li class=\"mt-list-item\">\n" +
   "  <div class=\"mt-as-link desc\">\n" +
   "    <span class=\"title\"></span>\n" +
   "    <span class=\"link\"></span>\n" +
   "  </div>\n" +
   "  <div class=\"mt-list-item-action mt-as-link logs\">\n" +
   "    <i class=\"zmdi zmdi-file-document\" title=\"Log files\"></i>\n" +
   "  </div>\n" +
   "  <div class=\"mt-list-item-action mt-as-link delete\">\n" +
   "    <i class=\"zmdi zmdi-delete\"></i>\n" +
   "  </div>\n" +
   "</li>";

gbcTemplates["ApplicationLauncherBookmarkWidget"] = "<div class=\"mt-card\">\n" +
   "  <div class=\"mt-card-texthead\">\n" +
   "    <i class=\"zmdi zmdi-bookmark\"></i>\n" +
   "    <span data-i18n=\"gwc.welcome.bookmark\">Bookmarks</span>\n" +
   "  </div>\n" +
   "  <div class=\"mt-card-body mt-card-body-fill\">\n" +
   "    <ul class=\"mt-list mt-list-narrow containerElement\">\n" +
   "    </ul>\n" +
   "  </div>\n" +
   "</div>";

gbcTemplates["ApplicationLauncherHistoryItemWidget"] = "<li class=\"mt-list-item\">\n" +
   "  <div class=\"mt-as-link desc\">\n" +
   "    <span class=\"title\"></span>\n" +
   "    <span class=\"link\"></span>\n" +
   "    <span class=\"logs\">\n" +
   "    </span>\n" +
   "  </div>\n" +
   "  <div class=\"mt-list-item-action mt-as-link logs\">\n" +
   "    <i class=\"zmdi zmdi-file-document\" title=\"Log files\"></i>\n" +
   "  </div>\n" +
   "  <div class=\"mt-list-item-action mt-as-link delete\">\n" +
   "    <i class=\"zmdi zmdi-delete\"></i>\n" +
   "  </div>\n" +
   "</li>";

gbcTemplates["ApplicationLauncherHistoryWidget"] = "<div class=\"mt-card\">\n" +
   "  <div class=\"mt-card-texthead\">\n" +
   "    <i class=\"zmdi zmdi-restore\"></i>\n" +
   "    <span data-i18n=\"gwc.welcome.history\">History</span>\n" +
   "    <a class=\"removeHistory\">\n" +
   "      <i class=\"zmdi zmdi-notification-clear-all\" title=\"Clear history\"></i>\n" +
   "    </a>\n" +
   "  </div>\n" +
   "  <div class=\"mt-card-body mt-card-body-fill\">\n" +
   "    <ul class=\"mt-list mt-list-narrow containerElement\">\n" +
   "    </ul>\n" +
   "  </div>\n" +
   "</div>";

gbcTemplates["ApplicationLauncherStartLogPlayerWidget"] = "<div>\n" +
   "  <span>Log Player&nbsp;</span>\n" +
   "  <button class=\"mt-button\" data-i18n=\"gwc.app.run\">Run</button>\n" +
   "</div>";

gbcTemplates["ApplicationLauncherUrlInputWidget"] = "<div>\n" +
   "  <input class=\"mt-field\" placeholder=\"UA Url launcher\">\n" +
   "  <button class=\"mt-button disabled\" disabled=\"disabled\" data-i18n=\"gwc.app.run\">Run</button>\n" +
   "</div>";

gbcTemplates["ApplicationLauncherWidget"] = "<div>\n" +
   "  <div class=\"mt-side-by-side containerElement\"></div>\n" +
   "</div>";

gbcTemplates["CanvasWidget"] = "<div></div>";

gbcTemplates["AccordionFolderWidget"] = "<div class=\"containerElement\"></div>";

gbcTemplates["CompleterWidget"] = "<div class=\"containerElement\"></div>";

gbcTemplates["DropDownWidget"] = "<div class=\"containerElement\" tabindex=\"0\" role=\"listbox\" aria-live=\"assertive\"></div>";

gbcTemplates["FolderWidget"] = "<div class=\"gbc_FolderWidget_titles_top\">\n" +
   "  <div class=\"mt-tabs\">\n" +
   "    <div class=\"mt-tab-titles-bar\">\n" +
   "      <div class=\"mt-tab-previous\"><i class=\"zmdi zmdi-chevron-left\"></i><i class=\"zmdi zmdi-chevron-up\"></i></div>\n" +
   "      <div class=\"mt-tab-titles\" role=\"tablist\">\n" +
   "        <div class=\"mt-tab-titles-container\"></div>\n" +
   "      </div>\n" +
   "      <div class=\"mt-tab-next\"><i class=\"zmdi zmdi-chevron-right\"></i><i class=\"zmdi zmdi-chevron-down\"></i></div>\n" +
   "    </div>\n" +
   "    <div class=\"mt-tab-items\">\n" +
   "      <div class=\"mt-tab-items-container containerElement gbc_dataContentPlaceholder\">\n" +
   "      </div>\n" +
   "    </div>\n" +
   "  </div>\n" +
   "</div>";

gbcTemplates["FormWidget"] = "<div>\n" +
   "  <div class=\"containerElement\">\n" +
   "    <div class=\"gbc_FormWidget_scrollkeeper\"></div>\n" +
   "  </div>\n" +
   "</div>";

gbcTemplates["GridWidget"] = "<div class=\"containerElement\"></div>";

gbcTemplates["GroupTitleWidget"] = "<div class=\"empty\">\n" +
   "  <span class=\"gbc-label-text-container\"></span>\n" +
   "  <span class=\"group-collapser\"><i class=\"zmdi zmdi-chevron-down zmdi-hc-2x\" title=\"Toggle collapse\"></i></span>\n" +
   "</div>";

gbcTemplates["GroupWidget"] = "<div>\n" +
   "  <div class=\"gbc_GroupWidgetContainer\">\n" +
   "    <div class=\"gbc_GroupWidgetContent\">\n" +
   "      <div class=\"containerElement\"></div>\n" +
   "    </div>\n" +
   "  </div>\n" +
   "</div>";

gbcTemplates["HBoxSplitViewWidget"] = "<div>\n" +
   "    <div class=\"splitViewContent\"><div class=\"containerElement\"></div></div>\n" +
   "    <div class=\"left_arrow disabled\"></div><div class=\"right_arrow disabled\"></div>\n" +
   "    <div class=\"dots disabled\"></div>\n" +
   "</div>";

gbcTemplates["HBoxWidget"] = "<div><div><div class=\"containerElement\" role=\"group\"></div></div></div>";

gbcTemplates["ListViewRowWidget"] = "<div class=\"\">\n" +
   " <div class=\"gbc_ListViewRowImage\"></div>\n" +
   " <div class=\"containerElement\"></div>\n" +
   "</div>";

gbcTemplates["ListViewWidget"] = "<div class=\"nohighlight\">\n" +
   "  <div class=\"gbc_ListViewScrollArea\">\n" +
   "    <div class=\"gbc_ListViewRowsContainer containerElement\"></div>\n" +
   "  </div>\n" +
   "</div>";

gbcTemplates["ModalWidget"] = "<div class=\"mt-dialog\" role=\"dialog\">\n" +
   "  <div class=\"mt-dialog-pane mt-card initial\">\n" +
   "    <div class=\"mt-dialog-header\">\n" +
   "      <div class=\"mt-dialog-title\"></div>\n" +
   "      <div class=\"movable_firefox_placekeeper\">.</div>\n" +
   "      <div class=\"mt-dialog-actions\">\n" +
   "          <span class=\"close\">\n" +
   "            <i class=\"zmdi zmdi-close\" title=\"Close window\"></i>\n" +
   "          </span>\n" +
   "      </div>\n" +
   "    </div>\n" +
   "    <div class=\"mt-dialog-content containerElement\"></div>\n" +
   "    <div class=\"mt-dialog-footer\"></div>\n" +
   "    <div\n" +
   "      class=\"mt-dialog-resizer\">\n" +
   "      <div class=\"sizable_firefox_placekeeper\">.</div>\n" +
   "      <i\n" +
   "        class=\"mt-resizer-icon zmdi zmdi-resize-bottom-right\"></i></div>\n" +
   "  </div>\n" +
   "</div>";

gbcTemplates["PagedScrollGridWidget"] = "<div>\n" +
   "  <div class=\"containerElement\"></div>\n" +
   "</div>";

gbcTemplates["PageTitleWidget"] = "<div class=\"mt-tab-title\" role=\"tab\" aria-selected=\"false\">\n" +
   "  <span class=\"mt-tab-title-text\"></span>\n" +
   "  <div class=\"mt-tab-title-actions\"></div>\n" +
   "</div>";

gbcTemplates["PageWidget"] = "<div class=\"mt-tab-item containerElement\" role=\"tabpanel\"></div>";

gbcTemplates["PaginationWidget"] = "<div>\n" +
   "  <i class=\"zmdi zmdi-chevron-left zmdi-hc-2x\"></i>\n" +
   "  <i class=\"zmdi zmdi-chevron-right zmdi-hc-2x\"></i>\n" +
   "</div>";

gbcTemplates["RowBoundDecoratorWidget"] = "<span><i class=\"zmdi zmdi-dots-vertical\"></i></span>";

gbcTemplates["ScrollGridWidget"] = "<div>\n" +
   "  <div class=\"containerElement\"></div>\n" +
   "</div>";

gbcTemplates["SpacerItemWidget"] = "<div role=\"separator\">\n" +
   "</div>";

gbcTemplates["SplitterWidget"] = "<div role=\"separator\">\n" +
   "  <i class=\"zmdi\"></i>\n" +
   "  <div class=\"firefox_placekeeper\">.</div>\n" +
   "</div>";

gbcTemplates["StackGroupWidget"] = "<div role=\"listitem\">\n" +
   "  <div class=\"gbc_GroupWidgetContainer\">\n" +
   "    <div class=\"gbc_GroupWidgetContent\">\n" +
   "      <div class=\"containerElement\"></div>\n" +
   "    </div>\n" +
   "  </div>\n" +
   "</div>";

gbcTemplates["StackLabelWidget"] = "<div role=\"listitem\">\n" +
   "</div>";

gbcTemplates["StackWidget"] = "<div class=\"containerElement\" role=\"list\"></div>";

gbcTemplates["StretchableScrollGridLineWidget"] = "<div class=\"nohighlight\">\n" +
   "  <div class=\"containerElement\"></div>\n" +
   "</div>";

gbcTemplates["StretchableScrollGridWidget"] = "<div>\n" +
   "  <div class=\"containerElement\"></div>\n" +
   "</div>";

gbcTemplates["TabbedApplicationCloseWidget"] = "<div class=\"gbc-disabled\">\n" +
   "  <i class=\"zmdi zmdi-close-circle\"></i>\n" +
   "</div>";

gbcTemplates["TabbedApplicationHostMenuWindowCloseWidget"] = "<li class=\"gbc-disabled\">\n" +
   "  <a class=\"mt-action\"><i class=\"zmdi zmdi-close-circle zmdi-hc-lg\" title=\"Close window\"></i></a>\n" +
   "</li>";

gbcTemplates["TableColumnAggregateWidget"] = "<div>\n" +
   "  <div class=\"gbc_TableAggregateText\"></div>\n" +
   "</div>";

gbcTemplates["TableColumnItemWidget"] = "<div>\n" +
   "  <div class=\"containerElement\"></div>\n" +
   "</div>";

gbcTemplates["TableColumnTitleWidget"] = "<div tabindex=\"0\" role=\"columnheader\">\n" +
   "  <span class=\"headerText\" draggable=\"true\"></span>\n" +
   "  <span class=\"resizer\" draggable=\"true\"></span>\n" +
   "</div>";

gbcTemplates["TableColumnWidget"] = "<div class=\"nohighlight\">\n" +
   "  <div class=\"gbc_dataContentPlaceholder containerElement\"></div>\n" +
   "  <div class=\"gbc_TableAfterLastItemZone\"></div>\n" +
   "</div>";

gbcTemplates["TableWidget"] = "<div role=\"table\">\n" +
   "  \n" +
   "  <div class=\"gbc_TableLeftContainer hidden\">\n" +
   "    <div class=\"gbc_TableLeftColumnsHeaders\"></div>\n" +
   "    <div class=\"gbc_TableLeftScrollArea\">\n" +
   "      <div class=\"gbc_TableLeftColumnsContainer\"></div>\n" +
   "    </div>\n" +
   "    <div class=\"gbc_TableLeftColumnsFooter\">\n" +
   "    </div>\n" +
   "  </div>\n" +
   "\n" +
   "  <div class=\"gbc_TableContainer\">\n" +
   "    <div class=\"gbc_TableColumnsHeaders\"></div>\n" +
   "    <div class=\"gbc_TableScrollArea\">\n" +
   "      <div class=\"gbc_TableColumnsContainer containerElement\"></div>\n" +
   "    </div>\n" +
   "    <div class=\"gbc_TableColumnsFooter hidden\">\n" +
   "      <div class=\"gbc_TableAggregateSpacer\"></div>\n" +
   "    </div>\n" +
   "  </div>\n" +
   "\n" +
   "  \n" +
   "  <div class=\"gbc_TableRightContainer hidden\">\n" +
   "    <div class=\"gbc_TableRightColumnsHeaders\"></div>\n" +
   "    <div class=\"gbc_TableRightScrollArea\">\n" +
   "      <div class=\"gbc_TableRightColumnsContainer\"></div>\n" +
   "    </div>\n" +
   "    <div class=\"gbc_TableRightColumnsFooter\">\n" +
   "    </div>\n" +
   "  </div>\n" +
   "\n" +
   "</div>";

gbcTemplates["TraditionalScreenWidget"] = "<div class=\"containerElement\"></div>";

gbcTemplates["TraditionalWindowContainerWidget"] = "<div></div>";

gbcTemplates["TraditionalWindowWidget"] = "<div></div>";

gbcTemplates["UserInterfaceWidget"] = "<div tabindex=\"0\">\n" +
   "  <div class=\"gbc_barsContainer\">\n" +
   "    <div class=\"gbc_chromeBarContainer\"></div>\n" +
   "    <div class=\"gbc_topMenuContainer\"></div>\n" +
   "    <div class=\"gbc_toolBarContainer\"></div>\n" +
   "  </div>\n" +
   "  <div class=\"gbc_contentContainer\">\n" +
   "    <div class=\"gbc_startMenuContainer\"></div>\n" +
   "    <div class=\"containerElement\"></div>\n" +
   "  </div>\n" +
   "</div>";

gbcTemplates["VBoxWidget"] = "<div><div><div class=\"containerElement\" role=\"group\"></div></div></div>";

gbcTemplates["WindowWidget"] = "<form>\n" +
   "    <div class=\"gbc_WindowMainContainer\">\n" +
   "        <div class=\"gbc_WindowTopMenuContainer\"></div>\n" +
   "        <div class=\"gbc_WindowToolbarContainer\"></div>\n" +
   "        <div class=\"gbc_WindowMenuContainerTop\"></div>\n" +
   "        <div class=\"gbc_WindowMenuContainerMiddle\">\n" +
   "            <div class=\"gbc_WindowMenuContainerLeft\"></div>\n" +
   "            <div class=\"gbc_WindowContent\">\n" +
   "                <div class=\"containerElement\"></div>\n" +
   "            </div>\n" +
   "            <div class=\"gbc_WindowMenuContainerRight\"></div>\n" +
   "        </div>\n" +
   "        <div class=\"gbc_WindowMenuContainerBottom\"></div>\n" +
   "    </div>\n" +
   "</form>";

gbcTemplates["DummyEditWidget"] = "<div class=\"mt-field gbc_dataContentPlaceholder\">\n" +
   "  <input type=\"text\" class=\"gbc-label-text-container\"/>\n" +
   "</div>";

gbcTemplates["DummyTextEditWidget"] = "<div class=\"mt-field gbc_dataContentPlaceholder\">\n" +
   "  <textarea></textarea>\n" +
   "</div>";

gbcTemplates["DateEditWidgetBase"] = "<div class=\"mt-field containerElement\" tabindex=\"0\">\n" +
   "  <div class=\"gbc_dataContentPlaceholder\"><input type=\"text\" class=\"gbc-label-text-container\"/></div>\n" +
   "  <i class=\"zmdi zmdi-calendar-blank widget-decoration\" title=\"Open picker\"></i>\n" +
   "</div>";

gbcTemplates["DateTimeEditWidgetBase"] = "<div class=\"mt-field containerElement\" tabindex=\"0\">\n" +
   "  <div class=\"gbc_dataContentPlaceholder\"><input type=\"text\" class=\"gbc-label-text-container\"/></div>\n" +
   "  <i class=\"zmdi zmdi-calendar-clock widget-decoration\" title=\"Open picker\"></i>\n" +
   "</div>";

gbcTemplates["SpinEditWidgetBase"] = "<div class=\"mt-field\" role=\"spinbutton\" aria-valuenow=\"0\">\n" +
   "  <div class=\"gbc_dataContentPlaceholder\">\n" +
   "    <input type=\"text\" step=\"any\" class=\"gbc-label-text-container\"/>\n" +
   "  </div>\n" +
   "  <div class=\"gbc_SpinEditWidget_arrows\">\n" +
   "    <div class=\"up\"><span>▲</span></div>\n" +
   "    <div class=\"down\"><span>▼</span></div>\n" +
   "  </div>\n" +
   "</div>";

gbcTemplates["TimeEditWidgetBase"] = "<div class=\"mt-field\">\n" +
   "  <div class=\"gbc_dataContentPlaceholder\">\n" +
   "    <input type=\"text\" class=\"gbc-label-text-container\"/>\n" +
   "  </div>\n" +
   "  <div class=\"gbc_TimeEditWidget_arrows\">\n" +
   "    <div class=\"up\"><span>▲</span></div>\n" +
   "    <div class=\"down\"><span>▼</span></div>\n" +
   "  </div>\n" +
   "</div>";

gbcTemplates["ButtonEditWidget"] = "<div></div>";

gbcTemplates["ButtonWidget"] = "<div>\n" +
   "  <div tabindex=\"0\" class=\"mt-button\" role=\"button\">\n" +
   "    <div class=\"textimage\">\n" +
   "      <span class=\"mt-button-text\"></span>\n" +
   "    </div>\n" +
   "  </div>\n" +
   "</div>";

gbcTemplates["CheckBoxWidget"] = "<div tabindex=\"0\" class=\"gbc_dataContentPlaceholder\" role=\"checkbox\">\n" +
   "  <div class=\"content\">\n" +
   "    <i class=\"zmdi unchecked\"></i>\n" +
   "  </div>\n" +
   "</div>";

gbcTemplates["ComboBoxWidget"] = "<div class=\"mt-field containerElement\" tabindex=\"0\" role=\"combobox\">\n" +
   "  <i class=\"zmdi toggle\" title=\"Open list\"></i>\n" +
   "</div>";

gbcTemplates["CommandLinkWidget"] = "<div>\n" +
   "  <div tabindex=\"0\" class=\"mt-button\">\n" +
   "    <div class=\"gbc_ImageContainer\"></div>\n" +
   "    <div class=\"command\">\n" +
   "      <span class=\"text\"></span>\n" +
   "      <span class=\"title\"></span>\n" +
   "    </div>\n" +
   "  </div>\n" +
   "</div>";

gbcTemplates["DateEditWidget"] = "<div class=\"mt-field containerElement\" tabindex=\"0\">\n" +
   "  <div class=\"gbc_dataContentPlaceholder\"><input type=\"text\" class=\"gbc-label-text-container\"/></div>\n" +
   "  <i class=\"zmdi zmdi-calendar-blank widget-decoration\" title=\"Open picker\"></i>\n" +
   "</div>";

gbcTemplates["DateTimeEditWidget"] = "<div class=\"mt-field containerElement\" tabindex=\"0\">\n" +
   "  <div class=\"gbc_dataContentPlaceholder\"><input type=\"text\" class=\"gbc-label-text-container\"/></div>\n" +
   "  <i class=\"zmdi zmdi-calendar-clock widget-decoration\" title=\"Open picker\"></i>\n" +
   "</div>";

gbcTemplates["EditWidget"] = "<div class=\"mt-field gbc_dataContentPlaceholder\">\n" +
   "  <input type=\"text\" class=\"gbc-label-text-container\" autocomplete=\"new-password\"/>\n" +
   "</div>";

gbcTemplates["HLineWidget"] = "<div role=\"separator\" aria-orientation=\"horizontal\"></div>";

gbcTemplates["ImageWidget"] = "<div tabindex=\"0\"></div>";

gbcTemplates["LabelWidget"] = "<div tabindex=\"0\" class=\"gbc_dataContentPlaceholder mt-label\" role=\"note\">\n" +
   "  <span class=\"gbc-label-text-container\"></span>\n" +
   "</div>";

gbcTemplates["MenuLabelWidget"] = "<div tabindex=\"0\" class=\"gbc_dataContentPlaceholder\">\n" +
   "  <span class=\"gbc-label-image-container\"></span>\n" +
   "  <span class=\"gbc-label-text-container\"></span>\n" +
   "  <span class=\"gbc-label-comment-container\"></span>\n" +
   "</div>";

gbcTemplates["MessageWidget"] = "<div role=\"alert\">\n" +
   "  <div class=\"message-text\"></div>\n" +
   "  <div class=\"close-button\">\n" +
   "    <i class=\"zmdi zmdi-close-circle\" title=\"Close message\"></i>\n" +
   "  </div>\n" +
   "</div>";

gbcTemplates["DateEditMobileWidget"] = "<div class=\"mt-field containerElement gbc_MobileWidget\" tabindex=\"0\">\n" +
   "  <div class=\"gbc_dataContentPlaceholder\"><input type=\"date\" class=\"gbc-label-text-container\"/></div>\n" +
   "  <label>\n" +
   "    <i class=\"zmdi zmdi-calendar-blank widget-decoration\" title=\"Open picker\"></i>\n" +
   "  </label>\n" +
   "</div>";

gbcTemplates["DateTimeEditMobileWidget"] = "<div class=\"mt-field containerElement gbc_MobileWidget\" tabindex=\"0\">\n" +
   "  <div class=\"gbc_dataContentPlaceholder\"><input type=\"datetime-local\" step=\"1\" class=\"gbc-label-text-container\"/></div>\n" +
   "  <label>\n" +
   "    <i class=\"zmdi zmdi-calendar-clock widget-decoration\" title=\"Open picker\"></i>\n" +
   "  </label>\n" +
   "</div>";

gbcTemplates["SpinEditMobileWidget"] = "<div class=\"mt-field\" role=\"spinbutton\">\n" +
   "  <div class=\"gbc_dataContentPlaceholder\">\n" +
   "    <input type=\"number\" step=\"any\" class=\"gbc-label-text-container\"/>\n" +
   "  </div>\n" +
   "  <div class=\"gbc_SpinEditWidget_arrows\">\n" +
   "    <div class=\"up\"><span>▲</span></div>\n" +
   "    <div class=\"down\"><span>▼</span></div>\n" +
   "  </div>\n" +
   "</div>";

gbcTemplates["TimeEditMobileWidget"] = "<div class=\"mt-field  gbc_MobileWidget\">\n" +
   "  <div class=\"gbc_dataContentPlaceholder\">\n" +
   "    <input type=\"time\" class=\"gbc-label-text-container\" step=\"1\"/>\n" +
   "  </div>\n" +
   "  <i class=\"zmdi zmdi-clock-outline widget-decoration\" title=\"Open picker\"></i>\n" +
   "\n" +
   "  <label class=\"gbc_TimeEditWidget_arrows hidden\">\n" +
   "    <div class=\"up\"><span>▲</span></div>\n" +
   "    <div class=\"down\"><span>▼</span></div>\n" +
   "  </label>\n" +
   "</div>";

gbcTemplates["ProgressBarWidget"] = "<div tabindex=\"0\" class=\"mt-progress gbc_dataContentPlaceholder\" role=\"progressbar\">\n" +
   "  <div class=\"mt-progress-bar\">\n" +
   "    <div class=\"mt-progress-level\" role=\"progressbar\"></div>\n" +
   "    <div class=\"mt-progress-bar-percentage\"><span>..</span></div>\n" +
   "  </div>\n" +
   "</div>";

gbcTemplates["RadioGroupItem"] = "<div class=\"gbc_RadioGroupItem\" tabindex=\"0\" role=\"radio\">\n" +
   "  <i class=\"zmdi unchecked\"></i>\n" +
   "  <span></span>\n" +
   "</div>";

gbcTemplates["RadioGroupWidget"] = "<div role=\"radiogroup\">\n" +
   "</div>";

gbcTemplates["RichTextWidget"] = "<div class=\"gbc_dataContentPlaceholder\">\n" +
   "  <iframe onload=\"\" frameborder='no' src=\"\" allowTransparency=\"true\"></iframe>\n" +
   "</div>";

gbcTemplates["RipGraphicWidget"] = "<div>\n" +
   "  <div></div>\n" +
   "</div>";

gbcTemplates["SliderWidget"] = "<div class=\"gbc_dataContentPlaceholder\">\n" +
   "  <input type=\"range\" step=\"1\"/>\n" +
   "</div>";

gbcTemplates["SpinEditWidget"] = "<div class=\"mt-field\" role=\"spinbutton\">\n" +
   "  <div class=\"gbc_dataContentPlaceholder\">\n" +
   "    <input type=\"text\" step=\"any\" class=\"gbc-label-text-container\"/>\n" +
   "  </div>\n" +
   "  <div class=\"gbc_SpinEditWidget_arrows\">\n" +
   "    <div class=\"up\"><span>▲</span></div>\n" +
   "    <div class=\"down\"><span>▼</span></div>\n" +
   "  </div>\n" +
   "</div>";

gbcTemplates["TextEditWidget"] = "<div class=\"mt-field gbc_dataContentPlaceholder\">\n" +
   "  <textarea></textarea>\n" +
   "</div>";

gbcTemplates["TimeEditWidget"] = "<div class=\"mt-field\">\n" +
   "  <div class=\"gbc_dataContentPlaceholder\">\n" +
   "    <input type=\"text\" class=\"gbc-label-text-container\"/>\n" +
   "  </div>\n" +
   "  <div class=\"gbc_TimeEditWidget_arrows widget-decoration\">\n" +
   "    <div class=\"up\"><span>▲</span></div>\n" +
   "    <div class=\"down\"><span>▼</span></div>\n" +
   "  </div>\n" +
   "</div>";

gbcTemplates["ToggleCheckBoxWidget"] = "<div tabindex=\"0\" class=\"gbc_dataContentPlaceholder\">\n" +
   "  <div class=\"content\">\n" +
   "    <div class=\"switch\" role=\"switch\">\n" +
   "      <label>\n" +
   "        <input type=\"checkbox\">\n" +
   "        <span class=\"lever\"></span>\n" +
   "      </label>\n" +
   "    </div>\n" +
   "    <div class=\"label\"></div>\n" +
   "  </div>\n" +
   "</div>";

gbcTemplates["FileInputWidget"] = "<div>\n" +
   "  <span data-i18n=\"gwc.file.upload.droporclick\"></span>\n" +
   "  <form enctype=\"multipart/form-data\">\n" +
   "    <input name=\"file\" type=\"file\"/>\n" +
   "  </form>\n" +
   "</div>";

gbcTemplates["WebComponentWidget"] = "<div class=\"gbc_dataContentPlaceholder\">\n" +
   "  <iframe onload=\"\" frameborder='no' src=\"\" allowTransparency=\"true\"></iframe>\n" +
   "</div>";

gbcTemplates["HtmlFilterWidget"] = "<div></div>";

gbcTemplates["FlowDecoratorWidget"] = "<i class=\"zmdi zmdi-dots-vertical\"></i>";

gbcTemplates["ScrollAreaWidget"] = "<div>\n" +
   "  <div class=\"spacer\"></div>\n" +
   "</div>";

gbcTemplates["ScrollBarWidget"] = "<div class=\"containerElement\">\n" +
   "  <div class=\"track\"></div>\n" +
   "  <div class=\"thumb\"></div>\n" +
   "</div>";

gbcTemplates["ScrollWidget"] = "<div>\n" +
   "  <div class=\"spacer\"></div>\n" +
   "</div>";

gbcTemplates["MyHeaderBarWidget"] = "<div>\n" +
   "  <b class=\"MyHeaderBarWidget-counter\"></b>\n" +
   "  <b class=\"MyHeaderBarWidget-title\"></b>\n" +
   "</div>";

gbcTemplates["MyMainContainerWidget"] = "<div>\n" +
   "  <header>\n" +
   "    <h3>WELCOME TO THE i2GEN PROJECT</h3>\n" +
   "  </header>\n" +
   "  \n" +
   "  <div class=\"containerElement\"></div>\n" +
   " <footer>\n" +
   "    <h3>©2018 i2GEN, LLC, All Rights reserved.</h3>\n" +
   "  </footer>\n" +
   "</div>";

gbcTemplates["ToolBarWidget"] = "<div class=\"mt-tab-titles-bar\" role=\"toolbar\" aria-orientation=\"horizontal\" style=\"background:skyblue;\">\n" +
   "  <div class=\"mt-tab-titles\">\n" +
   "    <div class=\"mt-tab-titles-container containerElement\"></div>\n" +
   "  </div>\n" +
   "  <div class=\"mt-tab-flow\"></div>\n" +
   "</div>";

/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Component } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ApiService } from './services/api.service';
import { UtilService } from './services/util.service';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages: any[] = [];
  selectedIndex: any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private navCtrl: NavController,
    private api: ApiService,
    public util: UtilService,
    private oneSignal: OneSignal,
    private router: Router
  ) {
    this.selectedIndex = 0;
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.appPages = this.util.appPage;
      console.log('%c Copyright and Good Faith Purchasers © 2020-present initappz. ', 'background: #222; color: #bada55');
      const lng = localStorage.getItem('language');
      if (!lng || lng === null) {
        this.api.get('users/getDefaultSettings').subscribe((data: any) => {
          console.log('get default settings', data);
          if (data && data.status === 200 && data.data) {
            const manage = data.data.manage;
            const language = data.data.lang;
            if (manage && manage.length > 0) {
              if (manage[0].app_close === 0 || manage[0].app_close === '0') {
                this.util.appClosed = true;
                this.util.appClosedMessage = manage[0].message;
              } else {
                this.util.appClosed = false;
              }
            } else {
              this.util.appClosed = false;
            }

            if (language) {
              this.util.translations = language;
              localStorage.setItem('language', data.data.file);
            }

            const settings = data.data.settings;
            if (settings && settings.length > 0) {
              const info = settings[0];
              this.util.direction = info.appDirection;
              this.util.cside = info.currencySide;
              this.util.currecny = info.currencySymbol;
              this.util.logo = info.logo;
              this.util.twillo = info.twillo;
              this.util.delivery = info.delivery;
              document.documentElement.dir = this.util.direction;
            } else {
              this.util.direction = 'ltr';
              this.util.cside = 'right';
              this.util.currecny = '$';
              document.documentElement.dir = this.util.direction;
            }

            const general = data.data.general;
            console.log('generalllll============================>', general)
            if (general && general.length > 0) {
              const info = general[0];
              this.util.general = info;
            }
            console.log('app is closed', this.util.appClosed);
          }

          console.log(this.util.translations);
          console.log(this.util.direction);
          console.log(this.util.cside);
          console.log(this.util.appClosed);
          console.log(this.util.appClosedMessage);
        }, error => {
          console.log('default settings', error);
        });
      } else {
        const param = {
          id: localStorage.getItem('language')
        };
        this.api.post('users/getDefaultSettingsById', param).subscribe((data: any) => {
          console.log('get default settings by id', data);
          if (data && data.status === 200 && data.data) {
            const manage = data.data.manage;
            const language = data.data.lang;
            if (manage && manage.length > 0) {
              if (manage[0].app_close === 0 || manage[0].app_close === '0') {
                this.util.appClosed = true;
                this.util.appClosedMessage = manage[0].message;
              } else {
                this.util.appClosed = false;
              }
            } else {
              this.util.appClosed = false;
            }

            if (language) {
              this.util.translations = language;
            }

            const settings = data.data.settings;
            console.log('-->', settings);
            if (settings && settings.length > 0) {
              const info = settings[0];
              this.util.direction = info.appDirection;
              this.util.cside = info.currencySide;
              this.util.currecny = info.currencySymbol;
              this.util.logo = info.logo;
              this.util.twillo = info.twillo;
              this.util.delivery = info.delivery;

              document.documentElement.dir = this.util.direction;
              console.log('wont');
            } else {
              this.util.direction = 'ltr';
              this.util.cside = 'right';
              this.util.currecny = '$';
              document.documentElement.dir = this.util.direction;
            }

            const general = data.data.general;
            console.log('generalllll============================>', general)
            if (general && general.length > 0) {
              const info = general[0];
              this.util.general = info;
            }
            console.log('app is closed', this.util.appClosed);
          }

          console.log(this.util.translations);
          console.log(this.util.direction);
          console.log(this.util.cside);
          console.log(this.util.appClosed);
          console.log(this.util.appClosedMessage);

        }, error => {
          console.log('default settings by id', error);
          this.util.appClosed = false;
          this.util.direction = 'ltr';
          this.util.cside = 'right';
          this.util.currecny = '$';
          document.documentElement.dir = this.util.direction;
        });
      }
      if (this.platform.is('cordova')) {
        setTimeout(async () => {
          await this.oneSignal.startInit(environment.onesignal.appId, environment.onesignal.googleProjectNumber);
          this.oneSignal.getIds().then((data) => {
            localStorage.setItem('fcm', data.userId);

            const uid = localStorage.getItem('uid');
            if (uid && uid !== null && uid !== 'null') {
              const param = {
                id: uid,
                fcm_token: data.userId
              };
              this.api.post('users/edit_profile', param).subscribe((data: any) => {
                console.log('user info=>', data);
              }, error => {
                console.log(error);
              });
            }

          });
          await this.oneSignal.endInit();
        }, 1000);
      }
      const uid = localStorage.getItem('uid');
      if (uid && uid !== null && uid !== 'null') {
        const param = {
          id: uid
        };
        this.api.post('drivers/getById', param).subscribe((data: any) => {
          console.log('*******************', data);
          if (data && data.status === 200 && data.data && data.data.length) {
            this.util.userInfo = data.data[0];
          }
        }, error => {
          console.log('==>>', error);
        });
      }

      this.platform.backButton.subscribe(async () => {
        console.log('asd', this.router.url, 'ad', this.router.isActive('/tabs/', true));
        if (this.router.url.includes('/tabs/') || this.router.url.includes('/login')) {
          navigator['app'].exitApp();
        }
      });
    });
  }

  logout() {
    localStorage.clear();
    this.navCtrl.navigateRoot(['/login']);
  }
}

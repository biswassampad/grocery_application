import { Router } from '@angular/router';
/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: any = '';
  password: any = '';
  constructor(
    private router: Router,
    private api: ApisService,
    private toastyService: ToastyService,
    private spinner: NgxSpinnerService,
    public util: UtilService
  ) { }

  ngOnInit(): void {
  }
  login() {

    if (!this.email || this.email === '' || !this.password || this.password === '') {
      this.error('All Fields are required');
      return false;
    }

    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailfilter.test(this.email)) {
      this.error('Please enter valid email');
      return false;
    }
    const param = {
      email: this.email,
      password: this.password
    };
    this.spinner.show();
    this.api.post('users/login', param).then((data: any) => {
      console.log('datas', data);

      if (data && data.status === 200) {
        if (data && data.data && data.data.type && data.data.type === 'store') {
          localStorage.setItem('uid', data.data.id);
          const store = {
            id: data.data.id
          };
          this.api.post('stores/getByUid', store).then((data: any) => {
            this.spinner.hide();
            console.log('*******************', data);
            if (data && data.status === 200 && data.data && data.data.length) {
              this.util.storeInfo = data.data[0];
              this.router.navigate(['']);
            }
          }, error => {
            this.spinner.hide();
            this.error(this.api.translate('Something went wrong'));
            console.log(error);
          }).catch(error => {
            this.spinner.hide();
            console.log(error);
          });
        } else {
          this.spinner.hide();
          this.error(this.api.translate('access denied'));
          return false;
        }
      } else if (data && data.status === 500) {
        this.spinner.hide();
        if (data.data && data.data.message) {
          this.error(data.data.message);
        } else {
          this.error(this.api.translate('Something went wrong'));
        }
      } else {
        this.error(this.api.translate('Something went wrong'));
      }

    }).catch(error => {
      this.spinner.hide();
      console.log('errror', error);
      this.error(this.api.translate('Something went wrong'));
    });
    // localStorage.setItem('uid', 'admin');
    // localStorage.setItem('type', 'admin');
    // this.router.navigate(['admin']);
  }


  error(message) {
    const toastOptions: ToastOptions = {
      title: this.api.translate('Error'),
      msg: message,
      showClose: true,
      timeout: 2000,
      theme: 'default',
      onAdd: (toast: ToastData) => {
        console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: () => {
        console.log('Toast  has been removed!');
      }
    };
    // Add see all possible types in one shot
    this.toastyService.error(toastOptions);
  }
  success(message) {
    const toastOptions: ToastOptions = {
      title: this.api.translate('Success'),
      msg: message,
      showClose: true,
      timeout: 2000,
      theme: 'default',
      onAdd: (toast: ToastData) => {
        console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: () => {
        console.log('Toast  has been removed!');
      }
    };
    // Add see all possible types in one shot
    this.toastyService.success(toastOptions);
  }

  reset() {
    this.router.navigate(['reset']);
  }
}

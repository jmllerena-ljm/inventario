import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export class GlobalService {
    API_URL = 'http://localhost:3977/api/';
    identity: any = null;
    token: string;
    constructor() {}
    getUrl() {
        return this.API_URL;
    }
    getIdentity() {
        const identity = JSON.parse(localStorage.getItem('session_user'));
        if (identity !== "undefined" && identity !== null) {
            this.identity = identity;
        } else {
            this.identity = null;
        }
        return this.identity;
    }
    getToken() {
        const token = localStorage.getItem('session_token');
        if (token !== "undefined" && token !== null) {
            this.token = token;
        } else {
            this.token = null;
        }
        return this.token;
    }
}
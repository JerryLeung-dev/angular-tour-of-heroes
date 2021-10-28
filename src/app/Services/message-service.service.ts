import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageServiceService {
  messages : string[] = []
  constructor() { }

  add(message: string):void {
    this.messages = [...this.messages, message];
  }

  clear():void{
    this.messages = [];
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmDialogContentConfig {
  title: string;
  body: string;
}

@Component({
  selector: 'app-confirm-dialog-content',
  templateUrl: './confirm-dialog-content.component.html',
  styleUrls: ['./confirm-dialog-content.component.scss'],
})
export class ConfirmDialogContentComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogContentConfig) {}

  ngOnInit(): void {}
}

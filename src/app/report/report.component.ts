import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { MyApiService } from '../service/my-api.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent {
  receiptName: any;
  i = 1; // Initialize counter
  fileField: string = '';
  getIndex(index: number): number {
    return index + 1; // Return 1-based index
  }

  getRole: string = '';
  ngOnInit() {
    this.getAll();
  }
  constructor(private apiService: MyApiService) {
    this.getRole = localStorage.getItem('role');
  }
  allDesign: any = [];
  allDesigns: any = [];

  getAll() {
    this.apiService.getAllDesign().subscribe((data) => {
      this.allDesigns = data;

      this.allDesigns.map((data: any) => {
        const isPending = data.sendForApproval === 'Pending';
        this.allDesign.push({
          "id": data.id,
          "reportName": data.reportName,
          "lastModifiedBy": data.lastModifiedBy,
          "updateTemplate": data.updateTemplate,
          "lastModifiedOn": data.lastModifiedOn,
          "preview": data.preview,
          "changeTemplate": data.changeTemplate,
          "sendForApproval": data.sendForApproval,
          "approveOrReject": data.approveOrReject,           
          "fileUploaded": true,
          "isApprove": !isPending,
          "isReject": !isPending
        })
      });
    })
  }
  downloadFile(fileName: string): void {
    this.apiService.downloadFile(fileName).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Download error:', error);
    });
  }
  generateReport(fileName: string,type:string) {
    this.receiptName = fileName;
    const obj={
      "fileName":fileName,
      "type":type
    }
    this.apiService.generateReport(obj).subscribe(
      (response: any) => {
        if (response['byteData']) {
          const byteCharacters = atob(response['byteData']);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);

          const blob = new Blob([byteArray], { type: 'application/pdf' });
          const blobUrl = URL.createObjectURL(blob);

          // Create an anchor element to trigger the download
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = response.fileName;
          // Trigger a click event on the anchor element to start the download
          a.click();
          // Clean up the blob URL after the download is initiated
          URL.revokeObjectURL(blobUrl);
        }
      },
    )
  }

  role: string = '';
  fileUploaded: boolean = true;
  onFileChanged(event: any, index: number) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      this.apiService.uploadFile(selectedFile,).subscribe(
        (response: any) => {
          console.log(response);
          this.showAlert(response.message, 'Success')
          //this.getAll();           
          this.allDesign[index].fileUploaded = false;
          //this.fileField = '';
        },
        err => {
          console.error(err);
          this.showAlert(err.error.message, 'Error')
          // this.getAll();
          // this.fileField = '';
        }
      );
    } else {
      alert('Please select a file first.');
    }
  }
  sendForApproval(id: any,index:number) {
    this.apiService.sendForApproval(id).subscribe(
      (response) => {
        this.allDesign[index].isApprove = false;
        this.allDesign[index].isReject = false;
        this.showAlert(response.message, 'Success')
      },
      err => {
        this.showAlert(err.error.message, 'Error')
      });
  }
  approve(id:number,input: any){
    this.apiService.isApprove(id,input).subscribe(
      (response) => {        
        this.showAlert(response.message, 'Success')
      },
      err => {
        this.showAlert(err.error.message, 'Error')
      });
  }
  reject(id:number,input: any){
    this.apiService.isApprove(id,input).subscribe(
      (response) => {        
        this.showAlert(response.message, 'Success')
      },
      err => {
        this.showAlert(err.error.message, 'Error')
      });
  }
  showAlert(msg: string, type: string) {
    Swal.fire({
      title: type + '!',
      text: msg,
      icon: type != 'Success' ? 'error' : 'success',
      confirmButtonText: 'OK'
    });
  }
}

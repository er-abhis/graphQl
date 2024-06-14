import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { valueType } from 'src/app/_interface/interface';
import { UsersService } from 'src/app/_services/users.service';
import { UiBasicModule } from 'src/app/component/ui-elements/ui-basic/ui-basic.module';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [SharedModule, UiBasicModule],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.scss',
})
export class PreferencesComponent {
  @ViewChild('addValueModal') addValueModal: any;
  allComprehensiveList: valueType[];
  limit: number;
  currentPage: number;
  totalItems: number;

  pageSize: number;
  totalPage: any[];
  addnewValueForm!: FormGroup;
  isEditMode: boolean = false;
  valueId: number;

  constructor(
    private modalService: NgbModal,
    private _user: UsersService,
    private toastr: ToastrService,
  ) {}
  ngOnInit() {
    this.fetchComprehensiveList(1, 10);
    this.addnewValueForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(15),
      ]),
    });
  }
  openAddValueModal() {
    const modalOptions: NgbModalOptions = {
      backdrop: 'static',
      centered: true,
    };

    this.modalService.open(this.addValueModal, modalOptions);
  }
  closeMoadal() {
    this.modalService.dismissAll();
    this.addnewValueForm.reset();
    this.isEditMode = false;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchComprehensiveList(this.currentPage, this.limit);
    }
  }
  goToPage(pageNumber: any) {
    this.currentPage = pageNumber;
    this.fetchComprehensiveList(pageNumber, this.limit);
  }
  nextPage(): void {
    if (this.currentPage < this.pageSize) {
      this.currentPage++;
      this.fetchComprehensiveList(this.currentPage, this.limit);
    }
  }

  fetchComprehensiveList(page: number, pageSize: number) {
    this._user.getComprehensiveList(page, pageSize).subscribe(
      (res: any) => {
        if (res.statusCode == 200) {
          // this.loading = false;
          this.allComprehensiveList = res.data;
          this.totalItems = res.pagination?.totalItems;
          this.currentPage = res.pagination?.currentPage;
          this.limit = res.pagination?.limit;
          this.pageSize = res.pagination?.totalpage;
          this.totalPage = Array.from(
            { length: this.pageSize },
            (_, i) => i + 1,
          );
        }
      },
      (err) => {
        this.toastr.error(err.error?.message);
      },
    );
  }

  editValue(value: valueType) {
    this.isEditMode = true;
    this.openAddValueModal();
    this.addnewValueForm.patchValue({
      name: value.name,
    });
    this.valueId = value.id;
  }
  saveCompList() {
    if (this.addnewValueForm.valid) {
      let name = this.addnewValueForm.value.name;
      name = this.capitalizeFirstLetter(name);
      if (this.isEditMode) {
        this._user.editComprehensiveList(this.valueId, name).subscribe(
          (res: any) => {
            if (res.statusCode == 200) {
              this.closeMoadal();
              this.fetchComprehensiveList(this.currentPage, this.limit);
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Preference Updated Successfully',
                showConfirmButton: false,
                timer: 1500,
              });
            }
          },
          (err) => {
            this.toastr.error(err.error?.message);
          },
        );
      } else {
        this._user.addComprehensiveList(name).subscribe(
          (res: any) => {
            if (res.statusCode == 200) {
              this.closeMoadal();
              this.fetchComprehensiveList(this.currentPage, this.limit);
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Preference added successfully',
                showConfirmButton: false,
                timer: 1500,
              });
            }
          },
          (err) => {
            this.toastr.error(err.error?.message);
          },
        );

        this.addnewValueForm.reset();
      }
    }
  }
  capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  deleteCompList(compId: valueType) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success mx-2',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
      allowOutsideClick: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this._user.deleteComprehensiveList(compId).subscribe(
            (res: any) => {
              if (res.statusCode == 200) {
                swalWithBootstrapButtons.fire({
                  title: 'Deleted!',
                  text: res.message,
                  icon: 'success',
                  timer: 2000,
                });
              }
              this.fetchComprehensiveList(this.currentPage, 10);
            },
            (err) => {
              this.toastr.error(err.error?.message);
            },
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: 'Cancelled',
            icon: 'error',
            timer: 1500,
          });
        }
      });
  }
}

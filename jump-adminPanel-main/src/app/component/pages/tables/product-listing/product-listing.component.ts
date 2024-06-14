import { Component, ViewChild } from '@angular/core';
import { UiBasicModule } from 'src/app/component/ui-elements/ui-basic/ui-basic.module';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ProductsService } from 'src/app/_services/product.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fieald } from './productConst';
import Swal from 'sweetalert2';
import { API_URL } from 'src/app/_interface/constants';
import { debounceTime } from 'rxjs';
import { DataEntity, RolesEntity } from 'src/app/_interface/interface';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import {
  PasswordStrengthValidator,
  trimValidator,
} from 'src/app/login/login.validators';

@Component({
  selector: 'app-product-listing',
  standalone: true,
  imports: [SharedModule, UiBasicModule],
  templateUrl: './product-listing.component.html',
  styleUrl: './product-listing.component.scss',
})
export class ProductListingComponent {
  @ViewChild('addProductModal') addProductModal: any;
  @ViewChild('ProfileModal') ProfileModal: any;

  allProducts: any = [];
  limit: number;
  currentPage: number;
  totalItems: number;
  pazeSize: number;
  totalPage: any[];

  NoDataFound: boolean = false;
  addProductForm!: FormGroup;
  formSubmitted = false;
  searchProduct!: FormGroup;
  activePage: number = 1;
  formFields = fieald;
  isEditMode: boolean = false;
  productId: any;
  productProfile: any;
  apiUrl = API_URL;

  constructor(
    private modalService: NgbModal,
    private _product: ProductsService,
    private toastr: ToastrService,
  ) {}
  ngOnInit() {
    this.fetchProducts(1, 10);



    this.addProductForm = new FormGroup({
      description: new FormControl('', [
        Validators.required,
        Validators.maxLength(15),
      ]),
      price: new FormControl('', [
        Validators.required,
        Validators.maxLength(15),
      ]),
      discount: new FormControl({ value: '', disabled: false }, [
        Validators.email,
        Validators.required,
        trimValidator(),
        this.validateDomain,
      ]),
     
    });
    this.searchProduct = new FormGroup({
      productName: new FormControl(''),
    });

    this.searchProduct
      .get('productName')
      .valueChanges.pipe(
        debounceTime(100), // Adjust debounce time as needed
      )
      .subscribe((value) => {
        if (!value?.trim()) {
          this.fetchProducts(1, 10);
        } else {
          this.findProduct(1, 10);
        }
      });
  }
  getEmailErrorMessage() {
    const emailControl = this.addProductForm.get('email');

    if (!emailControl) {
      return '';
    }

    const emailValue = emailControl.value ? emailControl.value.trim() : '';

    emailControl.setValue(emailValue);

    emailControl.updateValueAndValidity();

    const errors = emailControl.errors;

    if (!errors) {
      return '';
    }

    let errorMessage = '';

    switch (true) {
      case !!errors['required']:
        errorMessage = 'Email is required';
        break;
      case !!errors['email']:
        errorMessage = 'Enter a valid email address';
        break;

      case !!errors['invalidEmail']:
        errorMessage = '';
        break;
      case !!errors['invalidDomain']:
        errorMessage = 'Invalid domain name';
        break;
      default:
        errorMessage = '';
        break;
    }

    return errorMessage;
  }
  validateDomain(control: FormControl): { [key: string]: boolean } | null {
    const email = control.value;
    if (email && email.indexOf('@') > -1) {
      const domain = email.split('@')[1];
      const allowedDomains = ['com', 'in', 'org']; // Add your allowed domain extensions here
      const domainExtension = domain.split('.').pop(); // Extract domain extension
      if (!allowedDomains.includes(domainExtension)) {
        return { invalidDomain: true };
      }
    }
    return null;
  }
  getPasswordErrorMessage() {
    const passwordControl = this.addProductForm.get('password');

    if (!passwordControl) {
      return ''; // Return empty string if password control is not found
    }

    const errors = passwordControl.errors;

    if (!errors) {
      return ''; // Return empty string if there are no errors
    }

    let errorMessage = '';

    switch (true) {
      case !!errors['required']:
        errorMessage = 'Password is required';
        break;
      case !!errors['minlength']:
        errorMessage = `Password must be at least ${errors['minlength'].requiredLength} characters long`;
        break;
      case !!errors['maxlength']:
        errorMessage = `Password cannot exceed ${errors['maxlength'].requiredLength} characters`;
        break;
      case !!errors['passwordStrength']:
        errorMessage = errors['passwordStrength'];
        break;

      default:
        errorMessage = '';
        break;
    }

    return errorMessage;
  }
  openAddProductModal() {
    const modalOptions: NgbModalOptions = {
      backdrop: 'static',
      centered: true,
    };

    this.modalService.open(this.addProductModal, modalOptions);
  }
  closeMoadal() {
    this.modalService.dismissAll();
    this.isEditMode = false;
    this.addProductForm.get('email')?.enable();
    this.addProductForm.get('password')?.enable();
    this.addProductForm.reset();
    this.formSubmitted = false;
  }
  viewProfileModal() {
    this.modalService.open(this.ProfileModal, { centered: true });
  }

  nextPage(): void {
    if (this.currentPage < this.pazeSize) {
      this.currentPage++;
      this.fetchProducts(this.currentPage, this.limit);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchProducts(this.currentPage, this.limit);
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.activePage = page;
    this.fetchProducts(this.currentPage, this.limit);
  }

  flattenRoles(data: any) {
    data.forEach((data: any) => {
      delete data.createdAt;
      delete data.updatedAt;
      delete data.OTP;
      delete data.profile_pic;
      delete data.termsAndConditions;
    });

    const flattenedData = data.map((entry: any) => {
      const roles = entry.roles.map((role: any) => role.name);
      const compListing = entry.comprensive_listings.map(
        (val: any) => val.name,
      );
      return {
        ...entry,
        roles: roles.join(', '),
        comprensive_listings: compListing,
      };
    });
    return flattenedData;
  }

  downloadProductsAsCSV() {
    let count = 0;
    if (this.allProducts) {
      let allNewProduct = JSON.parse(JSON.stringify(this.allProducts));
      delete allNewProduct[0];
      delete allNewProduct[1];

      allNewProduct.shift();

      let header: any =
        'id,First Name,Last Name,Email,Company,Position,About,Status,Verified,Roles';

      for (let i = 0; i < this.allProducts.length; i++) {
        if (count == 10) {
          break;
        }
        if (this.allProducts[i].comprensive_listings.length > count) {
          count = this.allProducts[i].comprensive_listings.length;
        }
      }
      for (let i = 0; i < count; i++) {
        header = header.concat(`,Preference ${i + 1}`);
      }

      const csv = this.flattenRoles(allNewProduct)
        .map((row: any) => {
          return Object.values(row).join(',');
        })
        .join('\n');
      const csvData = header + csv;
      const blob = new Blob([csvData], { type: 'text/csv' });
      saveAs(blob, 'products.csv');
    }
  }
  findProduct(page: number, pageSize: number) {
    console.log('adjfbj', page, pageSize);
    this._product
      .searchProduct(this.searchProduct.value.productName, page, pageSize)
      .subscribe(
        (res) => {
          console.log(res.statusCode, 'adlkjh');
          if (res.statusCode == 400) {
            // this.NoDataFound = true;
            this.allProducts = null;
          } else {
            this.allProducts = res.data;
            this.totalItems = res.pagination?.totalItems;
            this.currentPage = res.pagination?.currentPage;
            this.limit = res.pagination?.limit;
            this.pazeSize = res.pagination?.totalpage;

            this.totalPage = Array.from(
              { length: this.pazeSize },
              (_, i) => i + 1,
            );
          }
        },
        (err) => {
          this.toastr.error(err.error?.message);
        },
      );
  }
  clearSearchForm() {
    this.searchProduct.get('productName').setValue('');
    this.fetchProducts(this.currentPage, this.limit);
  }
  fetchProducts(page: number, pageSize: number) {
    console.log('adjfbj', page, pageSize);

    const query = 'query {products {name,description,price,discount,created_at}}';
    this._product.getProducts(page, pageSize,query).subscribe(
      (res: any) => {
        console.log('res',res);
        
        
          this.allProducts = res.data.products.products;
          console.log('this.allProducts',this.allProducts);
          
          // this.totalItems = res.pagination?.totalItems;
          // this.currentPage = res.pagination?.currentPage;
          // this.limit = res.pagination?.limit;
          // this.pazeSize = res.pagination?.totalpage;

          // this.totalPage = Array.from(
          //   { length: this.pazeSize },
          //   (_, i) => i + 1,
          // );
        
      },
      (err) => {
        this.toastr.error(err.error?.message);
      },
    );
  }

  editProduct(product: DataEntity) {
    this.isEditMode = true;
    console.log('editMode', this.isEditMode);
    console.log('editMode', product);
    this.productId = product._id;
    this.openAddProductModal();
    this.addProductForm.patchValue({
      description: product.description || '',
      price: product.price,
      discount: product.discount,
    });

   
  }

  saveProduct() {
    console.log('save');
    
    this.formSubmitted = true;
   
  

      if (this.isEditMode) {
        console.log('edited');
        console.log('productId',this.productId);
     
        this._product
          .updateProduct(
            this.productId,
            this.addProductForm.value
          )
          .subscribe(
            (res: any) => {
              // if (res.statusCode == 200) {
                this.closeMoadal();
                this.fetchProducts(this.currentPage, this.limit);
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: res.message,
                  showConfirmButton: false,
                  timer: 1500,
                });
              }
            // },
            // (err) => {
            //   this.toastr.error(err.error?.message);
            // },
          );
      } else {
        // Register new product
        this._product
          .registerProduct(
            this.addProductForm.value

          )
          .subscribe(
            (res: any) => {
           
                this.closeMoadal();
                this.fetchProducts(this.currentPage, this.limit);
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: res.message,
                  showConfirmButton: false,
                  timer: 1500,
                });
            
            },
            (err) => {
              this.toastr.error(err.error?.message);
            },
          );
      }
    
  }
  capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  deleteProduct(productId: number, productRole: RolesEntity) {
    console.log('productId',productId);
    
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
         

            this._product.deleteProduct(productId).subscribe(
              (res: any) => {
                
                  swalWithBootstrapButtons.fire({
                    title: 'Deleted!',
                    text: 'Product deleted',
                    icon: 'success',
                    timer: 2000,
                  });
                  this.fetchProducts(this.currentPage, this.limit);
                
              },
              (err) => {
                this.toastr.error(err.error?.message);
              },
            );
       
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: 'Cancelled ',
            icon: 'error',
            timer: 1500,
          });
        }
      });
  }

  viewProduct(product: DataEntity) {
    this.viewProfileModal();
    this.productProfile = product;
    console.log(this.productProfile.profile_pic, 'fsdfs');
    console.log(this.apiUrl);
  }
  getColorClass(index: number): string {
    const colors = ['bg-danger', 'bg-warning', 'bg-success', 'bg-primary'];
    return colors[index % colors.length];
  }
}

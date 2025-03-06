import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-evoting',
  templateUrl: './evoting.component.html',
  styleUrls: ['./evoting.component.css'],
})
export class EvotingComponent {
  tab: string = 'register';
  registerData: any = {
    aadharNumber: '',
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    address: '',
    postalCode: '',
    contactNumber: '',
    password: '',
    imageFile: null,  // Holds the image file as a Blob
  };
  password: string = '';
  aadharNumber: string = '';
  signinData: any[] = [];

  adminData: any = {
    username: '',
    password: '',
  };

  webcamImage!: WebcamImage;
  triggerSnapshot: Subject<void> = new Subject<void>();

  constructor(private http: HttpClient, public app: AppComponent) {}

  setTab(tabName: string) {
    this.tab = tabName;
  }

  /** Handles Image Capture */
  triggerSnapshotHandler() {
    this.triggerSnapshot.next();
  }

  /** Converts captured image to Blob and assigns it to `registerData.imageFile` */
  handleImage(image: WebcamImage): void {
    this.webcamImage = image;

    fetch(image.imageAsDataUrl)
      .then((res) => res.blob())
      .then((blob) => {
        this.registerData.imageFile = new File([blob], 'image.jpg', { type: 'image/jpeg' });
      });
  }

  get triggerObservable(): Observable<void> {
    return this.triggerSnapshot.asObservable();
  }

  handleInitError(error: WebcamInitError): void {
    console.error('Webcam initialization error:', error);
    alert('Webcam initialization failed. Please check your camera permissions.');
  }

  /** Handles User Registration */
  onRegister() {
    const birthDate = new Date(this.registerData.dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 18) {
      alert('You must be at least 18 years old to register as a voter.');
      return;
    }

    const formData = new FormData();
    formData.append('aadharNumber', this.registerData.aadharNumber);
    formData.append('firstName', this.registerData.firstName);
    formData.append('lastName', this.registerData.lastName);
    formData.append('dob', this.registerData.dob);
    formData.append('gender', this.registerData.gender);
    formData.append('address', this.registerData.address);
    formData.append('postalCode', this.registerData.postalCode);
    formData.append('contactNumber', this.registerData.contactNumber);
    formData.append('password', this.registerData.password);

    if (this.registerData.imageFile) {
      formData.append('file', this.registerData.imageFile);
    }

    const url = 'http://localhost:8080/api/users/register';

    this.http.post(url, formData, { responseType: 'text' }).subscribe(
      (result) => {
        console.log('Registration successful:', result);
        alert(result); // Displays "User registered successfully."
        this.tab = 'signin';
      },
      (error) => {
        console.error('Registration error:', error);
        alert('Registration Failed. Please Try Again.');
      }
    );
  }

  /** Handles User Sign-In */
  onSignIn() {
    if (!this.aadharNumber || !this.password) {
      alert('Aadhar Number and Password are required.');
      return;
    }

    if (!/^\d{12}$/.test(this.aadharNumber)) {
      alert('Aadhar Number must be exactly 12 digits.');
      return;
    }

    const loginData = {
      aadharNumber: this.aadharNumber,
      password: this.password,
    };

    const url = 'http://localhost:8080/api/users/login';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post(url, loginData, { headers }).subscribe(
      (response: any) => {
        console.log('✅ Login Successful:', response);
        this.app.user = response; // Store voter info
        alert('Login Successful');
        this.app.id = 2; // Show voter dashboard

        // Check voter status after successful login
        this.checkVoterStatus();
      },
      (error) => {
        console.error('❌ Login Failed:', error);
        let errorMessage = 'Login failed. Please try again.';

        if (error.status === 401) {
          errorMessage = 'Invalid Aadhar Number or Password';
        } else if (error.status === 403) {
          errorMessage = 'Your account is not authenticated by the Admin.';
        }

        alert(errorMessage);
      }
    );
  }

  /** Checks Voter Status */
  checkVoterStatus() {
    if (this.app.user) {
      const url = 'http://localhost:8080/api/users/votestatus';

      this.http.post(url, this.app.user).subscribe(
        (response: any) => {
          console.log('Voter Status:', response);
          alert(response.status ? 'You have already voted.' : 'You have not voted yet.');
        },
        (error) => {
          console.error('Error fetching voter status:', error);
        }
      );
    }
  }

  /** Handles Admin Login */
  onAdminLogin() {
    if (!this.adminData.username || !this.adminData.password) {
      alert('Username and Password are required.');
      return;
    }

    const url = 'http://localhost:8080/api/admin/login';

    this.http.post(url, this.adminData).subscribe(
      (response) => {
        console.log('✅ Admin Login Successful:', response);
        alert('Admin Login Successful');
        this.app.id = 1; // Ensure ONLY admin login component is shown
      },
      (error) => {
        console.error('❌ Admin Login Failed:', error);
        alert('Invalid Admin Credentials');
      }
    );
  }
}

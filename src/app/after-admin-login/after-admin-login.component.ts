import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // Import HttpClient
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-after-admin-login',
  templateUrl: './after-admin-login.component.html',
  styleUrls: ['./after-admin-login.component.css']
})
export class AfterAdminLoginComponent {
  candidateData = {
    // id: 0,
    name: '',
    party: '',
    partySymbol: ''
  };

  candidateList: any[] = [];
  voterList: any[] = [];
  
  getAllVoters() {
    this.http.get<any[]>('http://localhost:8080/api/users').subscribe(
      (response) => {
        console.log('Fetched voters:', response);
        this.voterList = response;
      },
      (error) => {
        console.error('❌ Error fetching voters:', error);
      }
    );
  }

  authenticateVoter(aadharNumber: string) {
    this.http.post<{ message: string }>(`http://localhost:8080/api/admin/authenticate-voter/${aadharNumber}`, {})
      .subscribe(
        (response) => {
          console.log('✅ Voter Authenticated:', response.message);
          alert('Voter has been authenticated successfully.');
        },
        (error) => {
          console.error('❌ Authentication Failed:', error);
          alert('Error authenticating voter.');
        }
      );
  }
  


  constructor(private http: HttpClient, public app: AppComponent) { }
  onAddCandidate() {
    const newCandidate = { ...this.candidateData };
    console.log(newCandidate);
    // Send POST request to backend
    this.http.post('http://localhost:8080/api/candidates/add', newCandidate).subscribe(
      (response) => {

        console.log('Candidate added:', response);

        alert('Candidate added successfully');
        this.resetForm();
        this.getAllCandidates();
      },
      (error) => {
        console.error('Error adding candidate:', error);
        alert('Error adding candidate');
      }
    );
  }

  onDeleteCandidate(id: number) {
    this.http.delete(`http://localhost:8080/api/candidates/delete/${id}`).subscribe(
      (response) => {
        console.log('Candidate deleted:', response);
        alert('Candidate deleted successfully');
        this.candidateList = this.candidateList.filter(candidate => candidate.id !== id);
      },
      (error) => {
        console.error('Error deleting candidate:', error);
        alert('Error deleting candidate');
      }
    );
  }


  resetForm() {
    this.candidateData = {
      // id: 0,
      name: '',
      party: '',
      partySymbol: ''
    };
  }


  getAllCandidates() {
    this.http.get('http://localhost:8080/api/candidates/all').subscribe(
      (response: any) => {
        this.candidateList = response;
      },
      (error) => {
        console.error('Error fetching candidates:', error);
      }
    );
  }


  ngOnInit() {
    this.getAllCandidates();
    this.getAllVoters();
  }
}

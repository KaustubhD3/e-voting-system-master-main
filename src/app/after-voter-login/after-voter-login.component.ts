import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-after-voter-login',
  templateUrl: './after-voter-login.component.html',
  styleUrls: ['./after-voter-login.component.css']
})
export class AfterVoterLoginComponent implements OnInit {
  candidates: any[] = [];
  hasVoted: boolean = false;
  aadharNumber: string = '';
  isVotingAllowed = true;
  remainingTime: string = '';
  // votingEndTime = new Date('2025-02-15T15:00:00'); // Example voting end time

  constructor(private http: HttpClient, public app: AppComponent) { }

  ngOnInit() {
    this.fetchCandidates();
    // this.checkVoteStatus();
    // this.checkVotingTime();
  }

  // Fetch all candidates from the API
  fetchCandidates() {
    const url = 'http://localhost:8080/api/candidates/all';
    this.http.get<any[]>(url).subscribe(
      (response) => {
        console.log(response);
        
        this.candidates = response;
      },
      (error) => {
        console.error('Error fetching candidates:', error);
      }
    );
  }
  // Check if the user has already voted
  checkVoteStatus() {
    console.log(this.app.user);
    if (!this.app.user) return;

    const url = `http://localhost:8080/api/users/votestatus/${this.app.user.aadharNumber}`;

    this.http.get<boolean>(url).subscribe(
      (response) => {
        this.hasVoted = response;
        console.log("Has Voted", this.hasVoted);
      },
      (error) => {
        console.error('Error checking vote status:', error);
      }
    );
  }
  checkVotingTime() {
    const url = 'http://localhost:8080/api/candidates/voting-status';
    this.http.get<boolean>(url).subscribe(
      (response) => {
        this.isVotingAllowed = response;
        if (this.isVotingAllowed) {
          this.fetchRemainingTime();
        } else {
          this.remainingTime = 'Voting has ended';
        }
      },
      (error) => {
        console.error('Error checking voting status:', error);
      }
    );
  }
  fetchRemainingTime() {
    const now = new Date();
    const votingEndTime = new Date('2025-02-15T17:00:00'); // Set to your voting end time
    const timeDifference = votingEndTime.getTime() - now.getTime();

    if (timeDifference <= 0) {
      this.remainingTime = 'Voting is closed';
    } else {
      const hours = Math.floor(timeDifference / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      this.remainingTime = `${hours} hours and ${minutes} minutes remaining`;
    }
  }

  voteForCandidate(candidateId: number) {
    // console.log('aadharNumber:',  this.app.user);
    console.log('candidateId:', candidateId);
    if (! this.app.user || !candidateId) {
      alert('Aadhar Number or Candidate ID is missing');
      return;
    }

    const url = 'http://localhost:8080/api/candidates/vote';
    this.http.post(url, { aadharNumber:  this.app.user.aadharNumber, candidateId }).subscribe(
      (response) => {
        alert('Vote cast successfully!');
        this.hasVoted = true;
      },
      (error) => {
        alert('Error casting vote.');
        console.error('Error:', error);
      }
    );
  }
}

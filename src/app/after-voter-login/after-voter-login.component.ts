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
  isVotingAllowed: boolean = false;
  remainingTime: string = '';
  time_end= false;

  constructor(private http: HttpClient, public app: AppComponent) { }

  ngOnInit() {
    this.fetchCandidates();
    this.checkVoteStatus();
    this.checkVotingTime();
  }

  // Fetch all candidates from the API
  fetchCandidates() {
    const url = 'http://localhost:8080/api/candidates/all';
    this.http.get<any[]>(url).subscribe(
      (response) => {
        console.log('Candidates:', response);
        this.candidates = response;
      },
      (error) => {
        console.error('Error fetching candidates:', error);
      }
    );
  }

  // Check if the user has already voted
  checkVoteStatus() {
    if (!this.app.user) return;

    const url = `http://localhost:8080/api/users/votestatus/${this.app.user.aadharNumber}`;
    this.http.get<boolean>(url).subscribe(
      (response) => {
        this.hasVoted = response;
        console.log('Has Voted:', this.hasVoted);
      },
      (error) => {
        console.error('Error checking vote status:', error);
      }
    );
  }

  // Check if voting is currently allowed
  checkVotingTime() {
    const url = 'http://localhost:8080/api/candidates/voting-status';
    this.http.get<boolean>(url).subscribe(
      (response) => {
        this.isVotingAllowed = response;
        console.log('Voting Allowed:', this.isVotingAllowed);
        if (this.isVotingAllowed) {
          this.calculateRemainingTime();
        } else {
          this.remainingTime = 'Voting is currently closed';
        }
      },
      (error) => {
        console.error('Error checking voting status:', error);
      }
    );
  }

  // Calculate remaining time before voting closes
  calculateRemainingTime() {
    const now = new Date();
    const votingEndTime = new Date();
    votingEndTime.setHours(18, 0, 0, 0); // Voting ends at 6:00 PM

    let timeDifference = votingEndTime.getTime() - now.getTime();
      timeDifference=0;
    if (timeDifference <= 0) {
      this.remainingTime = 'Voting is closed';
      this.time_end= true;
    } else {
      const hours = Math.floor(timeDifference / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      this.remainingTime = `${hours} hours and ${minutes} minutes remaining`;
    }
  }

  // Vote for a candidate
  voteForCandidate(candidateId: number) {
    if (!this.app.user || !candidateId) {
      alert('Aadhar Number or Candidate ID is missing');
      return;
    }

    if (!this.isVotingAllowed) {
      alert('Voting is not allowed at this time.');
      return;
    }

    const url = 'http://localhost:8080/api/candidates/vote';
    this.http.post(url, { aadharNumber: this.app.user.aadharNumber, candidateId }).subscribe(
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

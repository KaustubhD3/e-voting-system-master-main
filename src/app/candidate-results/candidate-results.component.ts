import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-candidate-results',
  templateUrl: './candidate-results.component.html',
  styleUrls: ['./candidate-results.component.css'] // Fixed 'styleUrls' instead of 'styleUrl'
})
export class CandidateResultsComponent {
  candidates: any[] = [];
  winner: any = null; // Stores the winner

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchCandidates();
  }

  fetchCandidates() {
    this.http.get<any[]>('http://localhost:8080/api/candidates/results')
      .subscribe(data => {
        this.candidates = data;

        // Find the candidate with the most votes
        if (this.candidates.length > 0) {
          this.winner = this.candidates.reduce((prev, current) => 
            prev.votes > current.votes ? prev : current
          );
        }
      }, error => {
        console.error("Error fetching candidate results", error);
      });
  }
}

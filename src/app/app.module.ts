import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { EvotingComponent } from './evoting/evoting.component';
import { WebcamModule } from 'ngx-webcam'; // Import the WebcamModule
import { HttpClient, HttpClientModule,provideHttpClient, withFetch } from '@angular/common/http';
import { AfterAdminLoginComponent } from './after-admin-login/after-admin-login.component';
import { AfterVoterLoginComponent } from './after-voter-login/after-voter-login.component';
import { CandidateResultsComponent } from './candidate-results/candidate-results.component';
//import { AfterVoterLoginComponent } from './after-voter-login/after-voter-login.component';


@NgModule({
  declarations: [
    AppComponent,
    EvotingComponent,
    AfterAdminLoginComponent,
    AfterVoterLoginComponent,
    CandidateResultsComponent,
    //AfterVoterLoginComponent,
   
  ],
  imports: [
    HttpClientModule,
    BrowserModule,FormsModule,
    ReactiveFormsModule,
    WebcamModule, // Add WebcamModule to imports
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

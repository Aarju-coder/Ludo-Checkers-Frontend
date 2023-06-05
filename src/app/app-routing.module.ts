import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckersPlayWFriendsComponent } from './checkers-play-wfriends/checkers-play-wfriends.component';
import { CheckersComponent } from './checkers/checkers.component';
import { EmailOtpComponent } from './email-otp/email-otp.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { LeaderBoardComponent } from './leader-board/leader-board.component';
import { LoadingpageComponent } from './loadingpage/loadingpage.component';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { LudoLandingPageComponent } from './ludo-landing-page/ludo-landing-page.component';
import { LudoRandomPlayComponent } from './ludo-random-play/ludo-random-play.component';
import { LudoComponent } from './ludo/ludo.component';
import { PaymentHistoryComponent } from './payment/payment-history/payment-history.component';
import { PhoneLoginComponent } from './phone-login/phone-login.component';
import { PhoneOtpComponent } from './phone-otp/phone-otp.component';
import { PhoneSetPasswordComponent } from './phone-set-password/phone-set-password.component';
import { PhoneSignUpOtpComponent } from './phone-sign-up-otp/phone-sign-up-otp.component';
import { PhoneforgotPasswordComponent } from './phoneforgot-password/phoneforgot-password.component';
import { ProfileLogoutComponent } from './profile-logout/profile-logout.component';
import { ReedemMoneyComponent } from './payment/reedem-money/reedem-money.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { SetProfileComponent } from './set-profile/set-profile.component';
import { SettingsComponent } from './settings/settings.component';
import { StoreComponent } from './payment/store/store.component';
import { WalletComponent } from './payment/wallet/wallet.component';
import { LudoPlayWithFriendsComponent } from './ludo/ludo-play-with-friends/ludo-play-with-friends.component';
import { TutorialComponent } from './tutorial/tutorial.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { LudoWinnerPopUpComponent } from './ludo/ludo-winner-pop-up/ludo-winner-pop-up.component';
import { TournamentsComponent } from './tournaments/tournaments.component';
import { TournamentDetailsComponent } from './tournament-details/tournament-details.component';
import { BankinfoComponent } from './bankinfo/bankinfo.component';
import { TncComponent } from './tnc/tnc.component';
import { AddAgentComponent } from './club/add-agent/add-agent.component';
import { AgentDashboardComponent } from './club/agent-dashboard/agent-dashboard.component';
import { AgentPaymentDetailComponent } from './club/agent-payment-detail/agent-payment-detail.component';
import { AgentPaymentHistoryComponent } from './club/agent-payment-history/agent-payment-history.component';
import { BuyCoinComponent } from './club/buy-coin/buy-coin.component';
import { ClubDetailsComponent } from './club/club-details/club-details.component';
import { ClubLandingPageComponent } from './club/club-landing-page/club-landing-page.component';
import { CoinRequestComponent } from './club/coin-request/coin-request.component';
import { ConnectClubRequestComponent } from './club/connect-club-request/connect-club-request.component';
import { CreateClubComponent } from './club/create-club/create-club.component';
import { EmailLoginComponent } from './club/email-login/email-login.component';
import { LandingComponent } from './club/landing/landing.component';
import { ClubLoginPageComponent } from './club/login-page/login-page.component';
import { ManualAddAgentComponent } from './club/manual-add-agent/manual-add-agent.component';
import { OwnerDashboardComponent } from './club/owner-dashboard/owner-dashboard.component';
import { OwnerPaymentHistoryComponent } from './club/owner-payment-history/owner-payment-history.component';
import { ViewAgentComponent } from './club/view-agent/view-agent.component';
import { AccessclubForgotPasswordComponent } from './club/accessclub-forgot-password/accessclub-forgot-password.component';
import { AccessClubSetpasswordComponent } from './club/access-club-setpassword/access-club-setpassword.component';


const routes: Routes = [
  {path: '', component: LoadingpageComponent},
  {path: 'login', component: LoginpageComponent},
  {path: 'loading', component: LoadingpageComponent},
  {path: 'landingPage', component: LandingpageComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'checkers', component: CheckersComponent},
  {path: 'homePage', component: HomePageComponent},
  {path: 'setPassword', component: SetPasswordComponent},
  {path: 'settings', component: SettingsComponent},
  {path: 'profileLogout', component: ProfileLogoutComponent},
  {path: 'resetPassword', component: ResetPasswordComponent},
  {path:"phoneLogin", component:PhoneLoginComponent},
  {path:"forgotPassword", component:ForgotPasswordComponent},
  {path:"phoneforgotPassword", component:PhoneforgotPasswordComponent},
  {path:'phoneOTP', component:PhoneOtpComponent},
  {path:'emailOTP', component:EmailOtpComponent},
  {path:'phonesignupOTP', component:PhoneSignUpOtpComponent},
  {path:'phoneSetPassword',component:PhoneSetPasswordComponent},
  {path:'setProfile',component:SetProfileComponent},
  {path: 'ludoGame', component: LudoComponent},
  {path: 'ludoRandomPlay', component: LudoRandomPlayComponent},
  {path: 'ludoLandingPage', component: LudoLandingPageComponent},
  {path: 'checkersPlayWFriends', component: CheckersPlayWFriendsComponent},
  {path: 'leaderBoard', component: LeaderBoardComponent},
  {path: 'leaderBoard', component: LeaderBoardComponent},
  {path: 'wallet', component: WalletComponent},
  {path: 'store', component: StoreComponent},
  {path: 'redeem', component: ReedemMoneyComponent},
  {path: 'paymentHistory', component: PaymentHistoryComponent},
  {path: 'ludoPlayWFriends', component: LudoPlayWithFriendsComponent},
  {path: 'ludoWinnerPopUp', component: LudoWinnerPopUpComponent},
  {path: 'tutorial', component: TutorialComponent},
  {path: 'user-details', component: UserDetailsComponent},
  {path: 'bank-info', component: BankinfoComponent},
  {path: 'tournaments', component: TournamentsComponent},
  {path: 'tournament-details', component: TournamentDetailsComponent},
  {path: 'tnc', component: TncComponent},
  {path: 'clubLandingPage', component: LandingComponent},	
  {path: 'buyCoin', component: BuyCoinComponent},	
  {path: "clubLanding", component: ClubLandingPageComponent},	
  {path: "clubDetails", component: ClubDetailsComponent},	
  {path: "createClub", component: CreateClubComponent},	
  {path: "ownerDashboard", component: OwnerDashboardComponent},	
  {path: "agentDashboard", component: AgentDashboardComponent},	
  {path: 'viewAgent', component: ViewAgentComponent},	
  {path: 'agentPaymentDetail', component: AgentPaymentDetailComponent},	
  {path: 'addAgent', component: AddAgentComponent},	
  {path: 'ownerPaymentHistory', component: OwnerPaymentHistoryComponent},	
  {path: 'agentPaymentHistory', component: AgentPaymentHistoryComponent},	
  {path: 'emailLogin', component: EmailLoginComponent},	
  {path: "accessClub",component: ClubLoginPageComponent},	
  {path:"coinRequest",component:CoinRequestComponent},	
  {path:"connectClubRequest",component:ConnectClubRequestComponent},	
  {path:"addAgentManually",component:ManualAddAgentComponent},
  {path:"forgotpwdaccessclub",component:AccessclubForgotPasswordComponent},
  {path:"setPwdaccessclub",component:AccessClubSetpasswordComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

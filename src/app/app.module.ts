import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment.prod';
import { ClipboardModule } from 'ngx-clipboard';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { LoadingpageComponent } from './loadingpage/loadingpage.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { ProgressBarModule } from 'angular-progress-bar';
import { RegisterComponent } from './register/register.component';
import { FormsModule } from '@angular/forms';
import { CheckersComponent } from './checkers/checkers.component';
import { HomePageComponent } from './home-page/home-page.component';
import { HttpClientModule } from '@angular/common/http';
import {GlobalDetails} from './globalVars';
import { SettingsComponent } from './settings/settings.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { MessagepopupComponent } from './messagepopup/messagepopup.component';
import { ProfileLogoutComponent } from './profile-logout/profile-logout.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LudoComponent } from './ludo/ludo.component';
import { PhoneLoginComponent } from './phone-login/phone-login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PhoneforgotPasswordComponent } from './phoneforgot-password/phoneforgot-password.component';
import { PhoneOtpComponent } from './phone-otp/phone-otp.component';
import { EmailOtpComponent } from './email-otp/email-otp.component';
import { PhoneSetPasswordComponent } from './phone-set-password/phone-set-password.component';
import { PhoneSignUpOtpComponent } from './phone-sign-up-otp/phone-sign-up-otp.component';
import { SetProfileComponent } from './set-profile/set-profile.component';
import { LudoRandomPlayComponent } from './ludo-random-play/ludo-random-play.component';
import { LudoLandingPageComponent } from './ludo-landing-page/ludo-landing-page.component';
import { CheckersPlayWFriendsComponent } from './checkers-play-wfriends/checkers-play-wfriends.component';
import { LeaderBoardComponent } from './leader-board/leader-board.component';
import { WalletComponent } from './payment/wallet/wallet.component';
import { StoreComponent } from './payment/store/store.component';
import { ReedemMoneyComponent } from './payment/reedem-money/reedem-money.component';
import { SuccessPageComponent } from './payment/success-page/success-page.component';
import { PayPopupComponent } from './payment/payment-popup/pay-popup.component';
import { PaymentHistoryComponent } from './payment/payment-history/payment-history.component';
import { ShareonmobileService } from 'src/app/shareonmobile.service';
import { LudoPlayWithFriendsComponent } from './ludo/ludo-play-with-friends/ludo-play-with-friends.component';
import {IvyCarouselModule} from 'angular-responsive-carousel';
import { TutorialComponent } from './tutorial/tutorial.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { LudoWinnerPopUpComponent } from './ludo/ludo-winner-pop-up/ludo-winner-pop-up.component';
import { TournamentsComponent } from './tournaments/tournaments.component';
import { TournamentDetailsComponent } from './tournament-details/tournament-details.component';
import { BankinfoComponent } from './bankinfo/bankinfo.component';
import { TncComponent } from './tnc/tnc.component';
import { SoundServiceService } from 'src/services/sound-serviceWeb.service';
import { LanguageModel } from './language/langModel';
import {ConnectionServiceModule} from 'ng-connection-service';
import { PushNotificationService } from 'src/services/push-notification.service';
import { LudoSettingBtnComponent } from './ludo-setting-btn/ludo-setting-btn.component';
import { InternetConnectionService } from 'src/services/internet-connection.service';
import { NgxUiLoaderModule } from "ngx-ui-loader";
import { NgxPaginationModule } from 'ngx-pagination';
import { AddAgentSuccessComponent } from './club/add-agent-success/add-agent-success.component';
import { AddAgentComponent } from './club/add-agent/add-agent.component';
import { AgentDashboardComponent } from './club/agent-dashboard/agent-dashboard.component';
import { AgentDeleteComponent } from './club/agent-delete/agent-delete.component';
import { AgentPaymentDetailComponent } from './club/agent-payment-detail/agent-payment-detail.component';
import { AgentPaymentHistoryComponent } from './club/agent-payment-history/agent-payment-history.component';
import { BuyCoinComponent } from './club/buy-coin/buy-coin.component';
import { ClubDetailsComponent } from './club/club-details/club-details.component';
import { ClubLandingPageComponent } from './club/club-landing-page/club-landing-page.component';
import { CoinRequestComponent } from './club/coin-request/coin-request.component';
import { ConnectClubRequestComponent } from './club/connect-club-request/connect-club-request.component';
import { ConnectClubComponent } from './club/connect-club/connect-club.component';
import { CreateClubComponent } from './club/create-club/create-club.component';
import { EmailLoginComponent } from './club/email-login/email-login.component';
import { LandingComponent } from './club/landing/landing.component';
import { ClubLoginPageComponent } from './club/login-page/login-page.component';
import { ManualAddAgentComponent } from './club/manual-add-agent/manual-add-agent.component';
import { MessagepopupComponent1 } from './club/messagepopup/messagepopup.component';
import { OwnerDashboardComponent } from './club/owner-dashboard/owner-dashboard.component';
import { OwnerPaymentHistoryComponent } from './club/owner-payment-history/owner-payment-history.component';
import { PopupsuccessComponent } from './club/popupsuccess/popupsuccess.component';
import { RechargeAccountComponent } from './club/recharge-account/recharge-account.component';
import { RequestCoinComponent } from './club/request-coin/request-coin.component';
import { UpdateCoinRequestComponent } from './club/update-coin-request/update-coin-request.component';
import { ViewAgentComponent } from './club/view-agent/view-agent.component';
import { GlobalDetailsClub } from './club/clubGlobalVars';
import { AccessclubForgotPasswordComponent } from './club/accessclub-forgot-password/accessclub-forgot-password.component';
import { AccessClubSetpasswordComponent } from './club/access-club-setpassword/access-club-setpassword.component';
import { MessagingService } from 'src/services/messaging.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginpageComponent,
    LoadingpageComponent,
    LandingpageComponent,
    RegisterComponent,
    CheckersComponent,
    HomePageComponent,
    SetPasswordComponent,
    SettingsComponent,
    MessagepopupComponent,
    ProfileLogoutComponent,
    ResetPasswordComponent,
    LudoComponent,
    LudoRandomPlayComponent,
    LudoLandingPageComponent,
    PhoneLoginComponent,
    ForgotPasswordComponent,
    PhoneforgotPasswordComponent,
    PhoneOtpComponent,
    PhoneSetPasswordComponent,
    PhoneSignUpOtpComponent,
    EmailOtpComponent,
    SetProfileComponent,
    CheckersPlayWFriendsComponent,
    LeaderBoardComponent,
    WalletComponent,
    StoreComponent,
    ReedemMoneyComponent,
    SuccessPageComponent,
    PayPopupComponent,
    PaymentHistoryComponent,
    LudoPlayWithFriendsComponent,
    LudoWinnerPopUpComponent,
    TutorialComponent,
    UserDetailsComponent,
    BankinfoComponent,
    TournamentsComponent,
    TournamentDetailsComponent,
    TncComponent,
    LudoSettingBtnComponent,
    LandingComponent,	
    BuyCoinComponent,	
    ClubLandingPageComponent,	
    ClubDetailsComponent,	
    CreateClubComponent,	
    OwnerDashboardComponent,	
    AgentDashboardComponent,	
    ConnectClubComponent,	
    PopupsuccessComponent,	
    ViewAgentComponent,	
    AgentPaymentDetailComponent,	
    AgentDeleteComponent,	
    AddAgentComponent,	
    AddAgentSuccessComponent,	
    OwnerPaymentHistoryComponent,	
    RequestCoinComponent,	
    RechargeAccountComponent,	
    AgentPaymentHistoryComponent,	
    EmailLoginComponent,	
    MessagepopupComponent1,	
    ClubLoginPageComponent,	
    CoinRequestComponent,	
    UpdateCoinRequestComponent,	
    ConnectClubRequestComponent,	
    ManualAddAgentComponent, AccessclubForgotPasswordComponent, AccessClubSetpasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClipboardModule,
    ProgressBarModule,
    IvyCarouselModule,
    FormsModule,
    HttpClientModule,
    NgxUiLoaderModule,
    NgxPaginationModule,
    ConnectionServiceModule,
    AngularFireDatabaseModule,
AngularFireAuthModule,
AngularFireMessagingModule,
AngularFireModule.initializeApp(environment.firebaseConfig),
    // FontAwesomeModule
  ],
  providers: [GlobalDetails, GlobalDetailsClub, ShareonmobileService,PushNotificationService,MessagingService,SoundServiceService,LanguageModel,InternetConnectionService],
  bootstrap: [AppComponent]
})
export class AppModule { }

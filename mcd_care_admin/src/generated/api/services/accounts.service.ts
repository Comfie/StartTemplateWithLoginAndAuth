/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpContext } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { AccountResponse } from '../models/account-response';
import { AuthenticateRequest } from '../models/authenticate-request';
import { AuthenticateResponse } from '../models/authenticate-response';
import { CreateRequest } from '../models/create-request';
import { ForgotPasswordRequest } from '../models/forgot-password-request';
import { RegisterRequest } from '../models/register-request';
import { ResetPasswordRequest } from '../models/reset-password-request';
import { RevokeTokenRequest } from '../models/revoke-token-request';
import { UpdateRequest } from '../models/update-request';
import { UpdateUserRoleRequest } from '../models/update-user-role-request';
import { ValidateResetTokenRequest } from '../models/validate-reset-token-request';
import { VerifyEmailRequest } from '../models/verify-email-request';

@Injectable({
  providedIn: 'root',
})
export class AccountsService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation accountsAuthenticatePost
   */
  static readonly AccountsAuthenticatePostPath = '/Accounts/authenticate';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `accountsAuthenticatePost$Plain()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  accountsAuthenticatePost$Plain$Response(params?: {
    context?: HttpContext
    body?: AuthenticateRequest
  }
): Observable<StrictHttpResponse<AuthenticateResponse>> {

    const rb = new RequestBuilder(this.rootUrl, AccountsService.AccountsAuthenticatePostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<AuthenticateResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `accountsAuthenticatePost$Plain$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  accountsAuthenticatePost$Plain(params?: {
    context?: HttpContext
    body?: AuthenticateRequest
  }
): Observable<AuthenticateResponse> {

    return this.accountsAuthenticatePost$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<AuthenticateResponse>) => r.body as AuthenticateResponse)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `accountsAuthenticatePost$Json()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  accountsAuthenticatePost$Json$Response(params?: {
    context?: HttpContext
    body?: AuthenticateRequest
  }
): Observable<StrictHttpResponse<AuthenticateResponse>> {

    const rb = new RequestBuilder(this.rootUrl, AccountsService.AccountsAuthenticatePostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<AuthenticateResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `accountsAuthenticatePost$Json$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  accountsAuthenticatePost$Json(params?: {
    context?: HttpContext
    body?: AuthenticateRequest
  }
): Observable<AuthenticateResponse> {

    return this.accountsAuthenticatePost$Json$Response(params).pipe(
      map((r: StrictHttpResponse<AuthenticateResponse>) => r.body as AuthenticateResponse)
    );
  }

  /**
   * Path part for operation accountsRefreshTokenPost
   */
  static readonly AccountsRefreshTokenPostPath = '/Accounts/refresh-token';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `accountsRefreshTokenPost$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  accountsRefreshTokenPost$Plain$Response(params?: {
    context?: HttpContext
  }
): Observable<StrictHttpResponse<AuthenticateResponse>> {

    const rb = new RequestBuilder(this.rootUrl, AccountsService.AccountsRefreshTokenPostPath, 'post');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<AuthenticateResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `accountsRefreshTokenPost$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  accountsRefreshTokenPost$Plain(params?: {
    context?: HttpContext
  }
): Observable<AuthenticateResponse> {

    return this.accountsRefreshTokenPost$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<AuthenticateResponse>) => r.body as AuthenticateResponse)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `accountsRefreshTokenPost$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  accountsRefreshTokenPost$Json$Response(params?: {
    context?: HttpContext
  }
): Observable<StrictHttpResponse<AuthenticateResponse>> {

    const rb = new RequestBuilder(this.rootUrl, AccountsService.AccountsRefreshTokenPostPath, 'post');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<AuthenticateResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `accountsRefreshTokenPost$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  accountsRefreshTokenPost$Json(params?: {
    context?: HttpContext
  }
): Observable<AuthenticateResponse> {

    return this.accountsRefreshTokenPost$Json$Response(params).pipe(
      map((r: StrictHttpResponse<AuthenticateResponse>) => r.body as AuthenticateResponse)
    );
  }

  /**
   * Path part for operation accountsRevokeTokenPost
   */
  static readonly AccountsRevokeTokenPostPath = '/Accounts/revoke-token';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `accountsRevokeTokenPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  accountsRevokeTokenPost$Response(params?: {
    context?: HttpContext
    body?: RevokeTokenRequest
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AccountsService.AccountsRevokeTokenPostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `accountsRevokeTokenPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  accountsRevokeTokenPost(params?: {
    context?: HttpContext
    body?: RevokeTokenRequest
  }
): Observable<void> {

    return this.accountsRevokeTokenPost$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation accountsRegisterPost
   */
  static readonly AccountsRegisterPostPath = '/Accounts/register';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `accountsRegisterPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  accountsRegisterPost$Response(params?: {
    context?: HttpContext
    body?: RegisterRequest
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AccountsService.AccountsRegisterPostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `accountsRegisterPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  accountsRegisterPost(params?: {
    context?: HttpContext
    body?: RegisterRequest
  }
): Observable<void> {

    return this.accountsRegisterPost$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation accountsUpdateUserRolePut
   */
  static readonly AccountsUpdateUserRolePutPath = '/Accounts/update-user-role';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `accountsUpdateUserRolePut()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  accountsUpdateUserRolePut$Response(params?: {
    context?: HttpContext
    body?: UpdateUserRoleRequest
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AccountsService.AccountsUpdateUserRolePutPath, 'put');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `accountsUpdateUserRolePut$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  accountsUpdateUserRolePut(params?: {
    context?: HttpContext
    body?: UpdateUserRoleRequest
  }
): Observable<void> {

    return this.accountsUpdateUserRolePut$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation accountsVerifyEmailPost
   */
  static readonly AccountsVerifyEmailPostPath = '/Accounts/verify-email';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `accountsVerifyEmailPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  accountsVerifyEmailPost$Response(params?: {
    context?: HttpContext
    body?: VerifyEmailRequest
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AccountsService.AccountsVerifyEmailPostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `accountsVerifyEmailPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  accountsVerifyEmailPost(params?: {
    context?: HttpContext
    body?: VerifyEmailRequest
  }
): Observable<void> {

    return this.accountsVerifyEmailPost$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation accountsForgotPasswordPost
   */
  static readonly AccountsForgotPasswordPostPath = '/Accounts/forgot-password';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `accountsForgotPasswordPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  accountsForgotPasswordPost$Response(params?: {
    context?: HttpContext
    body?: ForgotPasswordRequest
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AccountsService.AccountsForgotPasswordPostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `accountsForgotPasswordPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  accountsForgotPasswordPost(params?: {
    context?: HttpContext
    body?: ForgotPasswordRequest
  }
): Observable<void> {

    return this.accountsForgotPasswordPost$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation accountsValidateResetTokenPost
   */
  static readonly AccountsValidateResetTokenPostPath = '/Accounts/validate-reset-token';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `accountsValidateResetTokenPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  accountsValidateResetTokenPost$Response(params?: {
    context?: HttpContext
    body?: ValidateResetTokenRequest
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AccountsService.AccountsValidateResetTokenPostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `accountsValidateResetTokenPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  accountsValidateResetTokenPost(params?: {
    context?: HttpContext
    body?: ValidateResetTokenRequest
  }
): Observable<void> {

    return this.accountsValidateResetTokenPost$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation accountsResetPasswordPost
   */
  static readonly AccountsResetPasswordPostPath = '/Accounts/reset-password';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `accountsResetPasswordPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  accountsResetPasswordPost$Response(params?: {
    context?: HttpContext
    body?: ResetPasswordRequest
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AccountsService.AccountsResetPasswordPostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `accountsResetPasswordPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  accountsResetPasswordPost(params?: {
    context?: HttpContext
    body?: ResetPasswordRequest
  }
): Observable<void> {

    return this.accountsResetPasswordPost$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation accountsGetAllUsersGet
   */
  static readonly AccountsGetAllUsersGetPath = '/Accounts/get-all-users';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `accountsGetAllUsersGet$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  accountsGetAllUsersGet$Plain$Response(params?: {
    context?: HttpContext
  }
): Observable<StrictHttpResponse<Array<AccountResponse>>> {

    const rb = new RequestBuilder(this.rootUrl, AccountsService.AccountsGetAllUsersGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<AccountResponse>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `accountsGetAllUsersGet$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  accountsGetAllUsersGet$Plain(params?: {
    context?: HttpContext
  }
): Observable<Array<AccountResponse>> {

    return this.accountsGetAllUsersGet$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<Array<AccountResponse>>) => r.body as Array<AccountResponse>)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `accountsGetAllUsersGet$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  accountsGetAllUsersGet$Json$Response(params?: {
    context?: HttpContext
  }
): Observable<StrictHttpResponse<Array<AccountResponse>>> {

    const rb = new RequestBuilder(this.rootUrl, AccountsService.AccountsGetAllUsersGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<AccountResponse>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `accountsGetAllUsersGet$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  accountsGetAllUsersGet$Json(params?: {
    context?: HttpContext
  }
): Observable<Array<AccountResponse>> {

    return this.accountsGetAllUsersGet$Json$Response(params).pipe(
      map((r: StrictHttpResponse<Array<AccountResponse>>) => r.body as Array<AccountResponse>)
    );
  }

  /**
   * Path part for operation accountsGetUserByIdIdGet
   */
  static readonly AccountsGetUserByIdIdGetPath = '/Accounts/get-user-by-id/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `accountsGetUserByIdIdGet$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  accountsGetUserByIdIdGet$Plain$Response(params: {
    id: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<AccountResponse>> {

    const rb = new RequestBuilder(this.rootUrl, AccountsService.AccountsGetUserByIdIdGetPath, 'get');
    if (params) {
      rb.path('id', params.id, {"style":"simple"});
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<AccountResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `accountsGetUserByIdIdGet$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  accountsGetUserByIdIdGet$Plain(params: {
    id: string;
    context?: HttpContext
  }
): Observable<AccountResponse> {

    return this.accountsGetUserByIdIdGet$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<AccountResponse>) => r.body as AccountResponse)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `accountsGetUserByIdIdGet$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  accountsGetUserByIdIdGet$Json$Response(params: {
    id: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<AccountResponse>> {

    const rb = new RequestBuilder(this.rootUrl, AccountsService.AccountsGetUserByIdIdGetPath, 'get');
    if (params) {
      rb.path('id', params.id, {"style":"simple"});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<AccountResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `accountsGetUserByIdIdGet$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  accountsGetUserByIdIdGet$Json(params: {
    id: string;
    context?: HttpContext
  }
): Observable<AccountResponse> {

    return this.accountsGetUserByIdIdGet$Json$Response(params).pipe(
      map((r: StrictHttpResponse<AccountResponse>) => r.body as AccountResponse)
    );
  }

  /**
   * Path part for operation accountsAdminCreateUserPost
   */
  static readonly AccountsAdminCreateUserPostPath = '/Accounts/admin-create-user';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `accountsAdminCreateUserPost$Plain()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  accountsAdminCreateUserPost$Plain$Response(params?: {
    context?: HttpContext
    body?: CreateRequest
  }
): Observable<StrictHttpResponse<AccountResponse>> {

    const rb = new RequestBuilder(this.rootUrl, AccountsService.AccountsAdminCreateUserPostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<AccountResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `accountsAdminCreateUserPost$Plain$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  accountsAdminCreateUserPost$Plain(params?: {
    context?: HttpContext
    body?: CreateRequest
  }
): Observable<AccountResponse> {

    return this.accountsAdminCreateUserPost$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<AccountResponse>) => r.body as AccountResponse)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `accountsAdminCreateUserPost$Json()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  accountsAdminCreateUserPost$Json$Response(params?: {
    context?: HttpContext
    body?: CreateRequest
  }
): Observable<StrictHttpResponse<AccountResponse>> {

    const rb = new RequestBuilder(this.rootUrl, AccountsService.AccountsAdminCreateUserPostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<AccountResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `accountsAdminCreateUserPost$Json$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  accountsAdminCreateUserPost$Json(params?: {
    context?: HttpContext
    body?: CreateRequest
  }
): Observable<AccountResponse> {

    return this.accountsAdminCreateUserPost$Json$Response(params).pipe(
      map((r: StrictHttpResponse<AccountResponse>) => r.body as AccountResponse)
    );
  }

  /**
   * Path part for operation accountsUpdateUserIdPut
   */
  static readonly AccountsUpdateUserIdPutPath = '/Accounts/update-user/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `accountsUpdateUserIdPut$Plain()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  accountsUpdateUserIdPut$Plain$Response(params: {
    id: string;
    context?: HttpContext
    body?: UpdateRequest
  }
): Observable<StrictHttpResponse<AccountResponse>> {

    const rb = new RequestBuilder(this.rootUrl, AccountsService.AccountsUpdateUserIdPutPath, 'put');
    if (params) {
      rb.path('id', params.id, {"style":"simple"});
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<AccountResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `accountsUpdateUserIdPut$Plain$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  accountsUpdateUserIdPut$Plain(params: {
    id: string;
    context?: HttpContext
    body?: UpdateRequest
  }
): Observable<AccountResponse> {

    return this.accountsUpdateUserIdPut$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<AccountResponse>) => r.body as AccountResponse)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `accountsUpdateUserIdPut$Json()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  accountsUpdateUserIdPut$Json$Response(params: {
    id: string;
    context?: HttpContext
    body?: UpdateRequest
  }
): Observable<StrictHttpResponse<AccountResponse>> {

    const rb = new RequestBuilder(this.rootUrl, AccountsService.AccountsUpdateUserIdPutPath, 'put');
    if (params) {
      rb.path('id', params.id, {"style":"simple"});
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<AccountResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `accountsUpdateUserIdPut$Json$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  accountsUpdateUserIdPut$Json(params: {
    id: string;
    context?: HttpContext
    body?: UpdateRequest
  }
): Observable<AccountResponse> {

    return this.accountsUpdateUserIdPut$Json$Response(params).pipe(
      map((r: StrictHttpResponse<AccountResponse>) => r.body as AccountResponse)
    );
  }

  /**
   * Path part for operation accountsDeleteUserIdDelete
   */
  static readonly AccountsDeleteUserIdDeletePath = '/Accounts/delete-user/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `accountsDeleteUserIdDelete()` instead.
   *
   * This method doesn't expect any request body.
   */
  accountsDeleteUserIdDelete$Response(params: {
    id: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AccountsService.AccountsDeleteUserIdDeletePath, 'delete');
    if (params) {
      rb.path('id', params.id, {"style":"simple"});
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `accountsDeleteUserIdDelete$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  accountsDeleteUserIdDelete(params: {
    id: string;
    context?: HttpContext
  }
): Observable<void> {

    return this.accountsDeleteUserIdDelete$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}

import test from "test";
import * as Assert from 'node:assert';
import "@angular/compiler";
import {
    FormControlAsyncValidators,
    FormControlTarget,
    FormGroupAsyncValidators,
    FormGroupTarget,
    FormGroupValidators,
    NestedFormGroup,
    toFormGroup
} from "./index.js";
import {AbstractControl, Validators} from "@angular/forms";
import {of} from "rxjs";


test('Basic controls length equality', () => {
    class LoginRequest {

        @FormControlTarget()
        username: string = '';

        @FormControlTarget()
        password: string = '';
    }

    const formGroup = toFormGroup(LoginRequest);

    Assert.equal(2, Object.keys(formGroup.controls).length, "Controls length does not match");
});

test('Controls length equality with secondary form', () => {
    class LoginRequest {

        @FormControlTarget()
        username: string = '';

        @FormControlTarget()
        @FormControlTarget([], "secondary")
        password: string = '';
    }

    const primaryFormGroup = toFormGroup(LoginRequest);
    Assert.equal(2, Object.keys(primaryFormGroup.controls).length, "Primary controls length does not match");

    const secondaryFormGroup = toFormGroup(LoginRequest, "secondary");
    Assert.equal(1, Object.keys(secondaryFormGroup.controls).length, "Secondaru controls length does not match");
});

test('Basic FormGroup has validators', () => {

    @FormGroupTarget()
    @FormGroupTarget("secondary")
    @FormGroupValidators(Validators.required, "secondary")
    class LoginRequest {

        @FormControlTarget()
        username: string = '';

        @FormControlTarget()
        @FormControlTarget([], "secondary")
        password: string = '';
    }

    const primaryFormGroup = toFormGroup(LoginRequest);
    Assert.notEqual(true, primaryFormGroup.hasValidator(Validators.required), "Primary form should not have any validators")

    const secondaryFormGroup = toFormGroup(LoginRequest, "secondary");
    Assert.ok(secondaryFormGroup.hasValidator(Validators.required), "Secondary form should have required validator");
});

test('Basic FormGroup has async validators', () => {

    const asyncValidator = (ctrl: AbstractControl) => of({isValid: ctrl.valid});

    @FormGroupTarget()
    @FormGroupTarget("secondary")
    @FormGroupValidators(Validators.required, "secondary")
    @FormGroupAsyncValidators(asyncValidator, "secondary")
    class LoginRequest {

        @FormControlTarget()
        username: string = '';

        @FormControlTarget()
        @FormControlTarget([], "secondary")
        password: string = '';
    }

    const primaryFormGroup = toFormGroup(LoginRequest);
    Assert.notEqual(true, primaryFormGroup.hasAsyncValidator(asyncValidator), "Primary form should not have any async validators")

    const secondaryFormGroup = toFormGroup(LoginRequest, "secondary");
    Assert.ok(secondaryFormGroup.hasAsyncValidator(asyncValidator), "Secondary form should have predefined async validatorr");
});

test('FormControl has validator', () => {

    const asyncValidator = (ctrl: AbstractControl) => of({isValid: ctrl.valid});
    const minLength5Validator = Validators.minLength(5);

    @FormGroupTarget()
    @FormGroupTarget("secondary")
    @FormGroupValidators(Validators.required, "secondary")
    @FormGroupAsyncValidators(asyncValidator, "secondary")
    class LoginRequest {

        @FormControlTarget(Validators.required)
        @FormControlTarget(minLength5Validator, "secondary")
        username: string = '';

        @FormControlTarget()
        @FormControlTarget([], "secondary")
        password: string = '';
    }

    const primaryFormGroup = toFormGroup(LoginRequest);
    Assert.ok(primaryFormGroup.get('username')?.hasValidator(Validators.required), "Primary form's username control should have a required validator");

    const secondaryFormGroup = toFormGroup(LoginRequest, "secondary");
    Assert.notEqual(true, secondaryFormGroup.get('username')?.hasValidator(Validators.required), "Secondary form's username should not have validators from primary form");
    Assert.ok(secondaryFormGroup.get('username')?.hasValidator(minLength5Validator), "Secondary form's username control should have a minLength(5) validator");

});

test('FormControl has async validator', () => {

    const asyncValidator = (ctrl: AbstractControl) => of({isValid: ctrl.valid});
    const minLength5Validator = Validators.minLength(5);

    @FormGroupTarget()
    @FormGroupTarget("secondary")
    @FormGroupValidators(Validators.required, "secondary")
    class LoginRequest {

        @FormControlTarget(Validators.required)
        @FormControlTarget(minLength5Validator, "secondary")
        @FormControlAsyncValidators(asyncValidator)
        username: string = '';

        @FormControlTarget()
        @FormControlTarget([], "secondary")
        password: string = '';
    }

    const primaryFormGroup = toFormGroup(LoginRequest);
    Assert.ok(!!primaryFormGroup.get('username')?.asyncValidator, "Primary form's username should have async validator");

    const secondaryFormGroup = toFormGroup(LoginRequest, "secondary");
    Assert.equal(false, !!secondaryFormGroup.get('username')?.asyncValidator, "Secondary form's username should not have async validator")

});

test('FormGroup has a nested FormGroup', () => {

    class ProfileRequest {
        @FormControlTarget()
        birthday: Date = new Date();
    }

    const asyncValidator = (ctrl: AbstractControl) => of({isValid: ctrl.valid});
    const minLength5Validator = Validators.minLength(5);

    @FormGroupTarget()
    @FormGroupTarget("secondary")
    @FormGroupValidators(Validators.required, "secondary")
    class LoginRequest {

        @FormControlTarget(Validators.required)
        @FormControlTarget(minLength5Validator, "secondary")
        @FormControlAsyncValidators(asyncValidator)
        username: string = '';

        @FormControlTarget()
        @FormControlTarget([], "secondary")
        password: string = '';

        @NestedFormGroup(ProfileRequest)
        profile: ProfileRequest = new ProfileRequest();
    }

    const primaryFormGroup = toFormGroup(LoginRequest);
    Assert.equal(toFormGroup(ProfileRequest), primaryFormGroup.get('profile'), 'Profile field in FormGroup should be the same as the FormGroup for ProfileRequest')
});

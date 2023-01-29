import {FormControlTarget, FormGroupTarget, NestedFormGroup, toFormGroup} from "../index";
import {Validators} from "@angular/forms";

@FormGroupTarget()
class ProfileRequest {

    @FormControlTarget()
    birthday: Date = new Date();
}

@FormGroupTarget()
class RegisterRequest {

    @FormControlTarget(Validators.minLength(5))
    username: string = '';

    @FormControlTarget([Validators.minLength(6), Validators.pattern(/[a-zA-Z0-9$%^*]+/g)])
    password: string = '';

    @NestedFormGroup(ProfileRequest)
    profile: ProfileRequest = new ProfileRequest();
}

const formGroup = toFormGroup<RegisterRequest>(RegisterRequest);
const loginRequest = formGroup.value;
console.log(loginRequest?.username);
console.log(loginRequest?.password);
console.log(loginRequest?.profile);

const profileGroup = toFormGroup<ProfileRequest>(ProfileRequest);

console.log(profileGroup == formGroup.get('profile'));


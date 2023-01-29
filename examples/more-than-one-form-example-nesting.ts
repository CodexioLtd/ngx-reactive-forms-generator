import {DEFAULT_GROUP, FormControlTarget, FormGroupTarget, NestedFormGroup, toFormGroup} from "../index";
import {Validators} from "@angular/forms";

@FormGroupTarget()
@FormGroupTarget("editProfileForm")
class ProfileRequest {

    @FormControlTarget()
    @FormControlTarget(Validators.required, "editProfileForm")
    birthday: Date = new Date();
}

@FormGroupTarget()
@FormGroupTarget("editUserForm")
class RegisterRequest {

    @FormControlTarget(Validators.minLength(5), [DEFAULT_GROUP, "editUserForm"])
    username: string = '';

    @FormControlTarget([Validators.minLength(6), Validators.pattern(/[a-zA-Z0-9$%^*]+/g)])
    @FormControlTarget(Validators.minLength(6), "editUserForm")
    password: string = '';

    @NestedFormGroup(ProfileRequest, "editProfileForm", [DEFAULT_GROUP, "editUserForm"])
    profile: ProfileRequest = new ProfileRequest();
}

const formGroup = toFormGroup<RegisterRequest>(RegisterRequest);
const loginRequest = formGroup.value;
console.log(loginRequest?.username);
console.log(loginRequest?.password);
console.log(loginRequest?.profile);

const profileGroup = toFormGroup<ProfileRequest>(ProfileRequest, "editProfileForm");

console.log(profileGroup == formGroup.get('profile'));

const defaultProfileGroup = toFormGroup<ProfileRequest>(ProfileRequest);
console.log(defaultProfileGroup == formGroup.get('profile')); // should not be equal



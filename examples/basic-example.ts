import {FormControlTarget, FormGroupTarget, toFormGroup} from "../index";
import {Validators} from "@angular/forms";

@FormGroupTarget()
class RegisterRequest {

    @FormControlTarget(Validators.minLength(5))
    username: string = '';

    @FormControlTarget([Validators.minLength(6), Validators.pattern(/[a-zA-Z0-9$%^*]+/g)])
    password: string = '';
}

const formGroup = toFormGroup<RegisterRequest>(RegisterRequest);
const loginRequest = formGroup.value;
console.log(loginRequest?.username);
console.log(loginRequest?.password);


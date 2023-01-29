# ngx-reactive-forms-generator
Creates Angular FormGroup instances from DTOs (e.g. class PersonRequest) using decorators

<a href="https://www.npmjs.com/package/@codexio/ngx-reactive-forms-generator" target="_blank"><img src="https://img.shields.io/npm/v/@codexio/ngx-reactive-forms-generator.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/package/@codexio/ngx-reactive-forms-generator" target="_blank"><img src="https://img.shields.io/npm/l/@codexio/ngx-reactive-forms-generator.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/package/@codexio/ngx-reactive-forms-generator" target="_blank"><img src="https://img.shields.io/npm/dm/@codexio/ngx-reactive-forms-generator.svg" alt="NPM Downloads" /></a>

# Table of Contents
- [Preambule](#preambule)
- [API Docs with Examples](#api-docs-with-examples)
  * [Decorator `@FormGroupTarget`](#decorator-formgrouptarget)
  * [Decorator `@FormGroupValidators`](#decorator-formgroupvalidators)
  * [Decorator `@FormGroupAsyncValidators`](#decorator-formgroupasyncvalidators)
  * [Decorator `@FormControlTarget`](#decorator-formcontroltarget)
  * [Decorator `@FormControlAsyncValidators`](#decorator-formcontrolasyncvalidators)
  * [Function `toFormGroup<Type>(Type, [FormIdType])`](#function-toformgrouptypetype-formidtype)
  * [Function `toFormGroups<Type>(Type, FormIdType[])`](#function-toformgroupstypetype-formidtype)
- [Installation](#installation)
  * [Installation / Usage Example](#installation--usage-example)

# Preambule[^](#table-of-contents "Table of Contents")
Have you felt the burden of describing your models in classes/interfaces and then redescribing them as `FormGroup` objects with multiple `FormControl` nested children? All the boilerplate that you need to write in order to achieve a decent **Reactive Forms** foundation in your project? It's not the case anymore!

With several TypeScript decorators called `@FormGroupTarget`, `@FormGroupValidators`, `@FormGroupAsyncValidators`, `@FormControlTarget` and `@FormControlAsyncValidators` you can have a Reactive Form right out of your DTO.

Forget having this repetition and boilerplate:

```ts
interface LoginForm {
    email: FormControl<string>;
    password?: FormControl<string>;
}

const loginFormGroup = new FormGroup<LoginForm>({
  email: new FormControl('', {nonNullable: true}),
  password: new FormControl('', Validators.minLength(6)),
});
```

But instead welcome:

```ts
class LoginForm {
   @FormControlTarget({nonNullable: true})
   email: string;
   
   @FormControlTarget(Validators.minLength(6))
   password: string;
}

const loginFormGroup = toFormGroup<LoginForm>(LoginForm)!;
```

# API Docs with Examples[^](#table-of-contents "Table of Contents")

## Decorator `@FormGroupTarget`[^](#table-of-contents "Table of Contents")

Decorator used on a class to denote that
this class will be a target type if a form group value.

If your class will be a target of multiple forms,
which have different options, validators, and
maybe subset of fields, you can use this decorator
multiple times, denoting a unique identifier called
**formId**. Then each validator and form control which
is participating in the particular form group should
share the same **formId**

Usage:
```ts
@FormGroupTarget()
@FormGroupTarget("editForm")
class InvoiceRequest {

}
```

## Decorator `@FormGroupValidators`[^](#table-of-contents "Table of Contents")

Decorator used on a class to denote that
this class, which is already a target of
a form group (**@FormGroupTarget**)
will have synchronous validators.

In order to add different validators to
different form groups of the same type,
an additional parameter **formId**
should be supplied

Example:
```ts
@FormGroupTarget()
@FormGroupValidators(Validators.email)

@FormGroupTarget("editForm")
@FormGroupValidators(Validators.requiredTrue, "editForm")
class InvoiceRequest {

}
```

If two or more forms share the same validators,
an array of **formId** could be supplied,
so they will reflect in all of them.
If you do not name your default form group, a formId will
be assigned from the library. In order to access it later
(e.g. in the **formId** array) use the
**DEFAULT_FORM** constant.

Example:
```ts
@FormGroupTarget()
@FormGroupTarget("editForm")
@FormGroupValidators([Validators.email, Validators.requiredTrue], [DEFAULT_FORM, "editForm"])
class InvoiceRequest {

}
    
```

## Decorator `@FormGroupAsyncValidators`[^](#table-of-contents "Table of Contents")

Decorator used on a class to denote that
this class, which is already a target of
a form group (**@FormGroupTarget**)
will have asynchronous validators.

In order to add different validators to
different form groups of the same type,
an additional parameter **formId**
should be supplied

Example:
```ts
@FormGroupTarget()
@FormGroupValidators(Validators.email)
@FormGroupAsyncValidators(ctrl => of({ value: ctrl.value}))

@FormGroupTarget("editForm")
@FormGroupValidators(Validators.requiredTrue, "editForm")
@FormGroupAsyncValidators(ctrl => of({ empty: !ctrl.value}))
class InvoiceRequest {

}
```

If two or more forms share the same validators,
an array of **formId** could be supplied,
so they will reflect in all of them.
If you do not name your default form group, a formId will
be assigned from the library. In order to access it later
(e.g. in the **formId** array) use the
**DEFAULT_FORM** constant.

Example:
```ts
@FormGroupTarget()
@FormGroupTarget("editForm")
@FormGroupValidators([Validators.email, Validators.requiredTrue], [DEFAULT_FORM, "editForm"])
@FormGroupAsyncValidators([ctrl => of({ value: ctrl.value}), ctrl => of({ empty: !ctrl.value})], [DEFAULT_FORM, "editForm"])
class InvoiceRequest {

}
```

## Decorator `@FormControlTarget`[^](#table-of-contents "Table of Contents")

Decorator used on a **field/property** or a
constructor **parameter** to denote that
this property is a **FormControl**

Same as `@FormGroupValidators` it can be associated
to a particular form group by supplying **formId**.

This decorator also accepts as an argument on or more
`Validators` or `FormControlOptions` (optionally).

Example:

```ts
@FormGroupTarget()
@FormGroupValidators(Validators.email)
@FormGroupAsyncValidators(ctrl => of({ value: ctrl.value}))

@FormGroupTarget("editForm")
@FormGroupValidators(Validators.requiredTrue, "editForm")
@FormGroupAsyncValidators(ctrl => of({ empty: !ctrl.value}))
class InvoiceRequest {

  @FormControlTarget(Validators.required)
  @FormControlTarget(Validators.minLength(3), "editForm")
  public num: string = '001';

  constructor(
      @FormControlTarget([], "editForm")
      public date: Date = new Date()
  ) { }
}
```

 If a form control shares the same settings on two or more
 form groups, an array of **formId** can be supplied

Example:

```ts
@FormGroupTarget()
@FormGroupValidators(Validators.email)
@FormGroupAsyncValidators(ctrl => of({ value: ctrl.value}))

@FormGroupTarget("editForm")
@FormGroupValidators(Validators.requiredTrue, "editForm")
@FormGroupAsyncValidators(ctrl => of({ empty: !ctrl.value}))
class InvoiceRequest {

  @FormControlTarget([Validators.required, Validators.minLength(3)], [DEFAULT_FORM, "editForm"])
  public num: string = '001';

  constructor(
      @FormControlTarget([], [DEFAULT_FORM, "editForm"])
      public date: Date = new Date()
  ) { }
}
```

## Decorator `@FormControlAsyncValidators`[^](#table-of-contents "Table of Contents")

Decorator used on a **field/property** or a
constructor **parameter** to denote that
this form control has asynchronous validators.

Same as `@FormGroupValidators` it can be associated
to a particular form group by supplying **formId**.


Example:

```ts
@FormGroupTarget()
@FormGroupValidators(Validators.email)
@FormGroupAsyncValidators(ctrl => of({ value: ctrl.value}))

@FormGroupTarget("editForm")
@FormGroupValidators(Validators.requiredTrue, "editForm")
@FormGroupAsyncValidators(ctrl => of({ empty: !ctrl.value}))
class InvoiceRequest {

  @FormControlTarget(Validators.required)
  @FormControlTarget(Validators.minLength(3), "editForm")
  @FormControlAsyncValidators(ctrl => of({ ok: ctrl.state == 'VALID'}))
  @FormControlAsyncValidators(ctrl => of({ notOk: ctrl.state != 'VALID'}), "editForm")
  public num: string = '001';

  constructor(
      @FormControlTarget([], "editForm")
      @FormControlAsyncValidators(ctrl => of({ ok: ctrl.state == 'VALID'}))
      public date: Date = new Date()
  ) { }
}
```

 If a form control shares the same async validators on two or more
 form groups, an array of <strong>formId</strong> can be supplied

Example:

```ts
@FormGroupTarget()
@FormGroupValidators(Validators.email)
@FormGroupAsyncValidators(ctrl => of({ value: ctrl.value}))

@FormGroupTarget("editForm")
@FormGroupValidators(Validators.requiredTrue, "editForm")
@FormGroupAsyncValidators(ctrl => of({ empty: !ctrl.value}))
class InvoiceRequest {

  @FormControlTarget([Validators.required, Validators.minLength(3)], [DEFAULT_FORM, "editForm"])
  @FormControlAsyncValidators([ctrl => of({ ok: ctrl.state == 'VALID'}), ctrl => of({ notOk: ctrl.state != 'VALID'})], [DEFAULT_FORM, "editForm"])
  public num: string = '001';

  constructor(
      @FormControlTarget([], [DEFAULT_FORM, "editForm"])
      @FormControlAsyncValidators(ctrl => of({ ok: ctrl.state == 'VALID'}), [DEFAULT_FORM, "editForm"])
      public date: Date = new Date()
  ) { }
}
```

## Function `toFormGroup<Type>(Type, [FormIdType])`[^](#table-of-contents "Table of Contents")

This function returns a FormGroup (in particular an
enhanced **ModelFormGroup** which **value<**
property will be of a generic type supplied) based on the decorators
upon a class.

Example:

```ts
ngOnInit(): void {
    const formGroup = toFormGroup<InvoiceRequest>(InvoiceRequest);
    const invoice: InvoiceRequest = formGroup.value!;
}
```

It accepts an optional second parameter *fromId* if you want to retrieve a particular (non-default) form.

Example

```ts
ngOnInit(): void {
    const defaultFormGroup = toFormGroup<InvoiceRequest>(InvoiceRequest);
    const defaultInvoice: InvoiceRequest = defaultFormGroup.value!;
    
    const editFormGroup = toFormGroup<InvoiceRequest>(InvoiceRequest, "editForm");
    const editInvoice: InvoiceRequest = editFormGroup.value!;
}
```

## Function `toFormGroups<Type>(Type, FormIdType[])`[^](#table-of-contents "Table of Contents")

Same as `toFromGroup`, but gives an array of form groups associated to this `Type` depending on the array of *formId* supplied.
If empty array is supplied, it will return all form groups associated to the given `Type`

Example:

```ts
ngOnInit(): void {
    const allFormGroupsImplicit = toFormGroups<InvoiceRequest>(InvoiceRequest);
    allFormGroupsImplicit.forEach(invoiceFormGroup => {
        const invoice: InvoiceRequest = invoiceFormGroup.value!;
    });
    
    const allFormGroupsExplicit = toFormGroups<InvoiceRequest>(InvoiceRequest, [DEFAULT_FORM, "editForm"]);
    allFormGroupsExplicit.forEach(invoiceFormGroup => {
        const invoice: InvoiceRequest = invoiceFormGroup.value!;
    });
}
```

# Installation[^](#table-of-contents "Table of Contents")

Installation is very simple. You just need to install the `npm` package `@codexio/ngx-reactive-forms-generator` into your Angular project. Then all the above decorators and functions will be available to be imported across your project

## Installation / Usage Example[^](#table-of-contents "Table of Contents")

**Terminal**
```
$ npm i @codexio/ngx-reactive-forms-generator
```

**app.component.ts**
```ts
import {FormControlTarget, ModelFormGroup, toFormGroup} from "@codexio/ngx-reactive-forms-generator";

import {Component} from '@angular/core';
import {Validators} from "@angular/forms";

class LoginForm {
  @FormControlTarget({updateOn: 'submit', validators: Validators.required})
  email: string = '';

  @FormControlTarget(Validators.minLength(6))
  password: string = '';
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  loginForm: ModelFormGroup<LoginForm> = toFormGroup<LoginForm>(LoginForm)!;

  login() {
    console.log(this.loginForm);
    console.log(this.loginForm.value); // LoginForm object
  }
  
}
```

**app.component.html** *(Not related to this library, it uses standard Reactive Forms notations)*:

```html
<h1>Login</h1>
<form [formGroup]="loginForm" (ngSubmit)="login()">
  <input type="text" formControlName="email" /><br/>
  <div *ngIf="loginForm.get('email')?.errors?.['required'] && loginForm.get('email')?.dirty">
    Username is required <!-- Will appear after submit -->
  </div>

  <input type="password" formControlName="password" /><br/>
  <div *ngIf="loginForm.get('password')?.errors?.['minlength'] && loginForm.get('password')?.dirty">
    Password too short <!-- Will appear when you change the value and it's with length < 6 -->
  </div>

  <button type="submit">Login</button>
</form>
```

Enjoy :)

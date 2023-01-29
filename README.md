# ngx-reactive-forms-generator
Creates Angular FormGroup instances from DTOs (e.g. class PersonRequest) using decorators

# Preambule
Have you felt the burdon of describing your models in classes/interfaces and then redescribing them as `FormGroup` objects with multiple `FormControl` nested children? All the boilerplate that you need to write in order to achieve a decent **Reactive Forms** foundation in your project? It's not the case anymore!

With several TypeScript decorators called `@FormGroupTarget`, `@FormGroupValidators`, `@FormGroupAsyncValidators`, `@FormControlTarget` and `@FormControlAsyncValidators` you can have a Reactive Form right out of your DTO.

Forget having this repetition and boilerplate:

```
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

```
class LoginForm {
   @FormControlTarget({nonNullable: true})
   email: string;
   
   @FormControlTarget(Validators.minLength(6))
   password: string;
}

const loginFormGroup = toFormGroup<LoginForm>(LoginForm)!;
```

# API Docs with examples

## Decorator `@FormGroupTarget`

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
```

    @FormGroupTarget()
    @FormGroupTarget("editForm")
    class InvoiceRequest {

    }

```

## Decorator `@FormGroupValidators`

Decorator used on a class to denote that
this class, which is already a target of
a form group (**@FormGroupTarget**)
will have synchronous validators.

In order to add different validators to
different form groups of the same type,
an additional parameter **formId**
should be supplied

Example:
```

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
```

    @FormGroupTarget()
    @FormGroupTarget("editForm")
    @FormGroupValidators([Validators.email, Validators.requiredTrue], [DEFAULT_FORM, "editForm"])
    class InvoiceRequest {

    }
    
```

## Decorator `@FormGroupAsyncValidators`

Decorator used on a class to denote that
this class, which is already a target of
a form group (**@FormGroupTarget**)
will have asynchronous validators.

In order to add different validators to
different form groups of the same type,
an additional parameter **formId**
should be supplied

Example:
```

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
```

    @FormGroupTarget()
    @FormGroupTarget("editForm")
    @FormGroupValidators([Validators.email, Validators.requiredTrue], [DEFAULT_FORM, "editForm"])
    @FormGroupAsyncValidators([ctrl => of({ value: ctrl.value}), ctrl => of({ empty: !ctrl.value})], [DEFAULT_FORM, "editForm"])
    class InvoiceRequest {

    }

```

## Decorator `@FormControlTarget`

Decorator used on a **field/property** or a
constructor **parameter** to denote that
this property is a **FormControl**

Same as `@FormGroupValidators` it can be associated
to a particular form group by supplying **formId**.

This decorator also accepts as an argument on or more
`Validators` or `FormControlOptions` (optionally).

Example:

```
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
          public date: Date = new Date();
      )
    }
```

 If a form control shares the same settings on two or more
 form groups, an array of **formId** can be supplied

Example:

```
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
          public date: Date = new Date();
      )
    }
```

## Decorator `@FormControlAsyncValidators`

Decorator used on a **field/property** or a
constructor **parameter** to denote that
this form control has asynchronous validators.

Same as `@FormGroupValidators` it can be associated
to a particular form group by supplying **formId**.


Example:

```
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
          public date: Date = new Date();
      )
    }
```

 If a form control shares the same async validators on two or more
 form groups, an array of <strong>formId</strong> can be supplied

Example:

```
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
          public date: Date = new Date();
      )
    }
```

## Function `toFormGroup<Type>(Type, [FormIdType])`

This function returns a FormGroup (in particular an
enhanced **ModelFormGroup** which **value<**
property will be of a generic type supplied) based on the decorators
upon a class.

Example:

```
    ngOnInit(): void {
        const formGroup = toFormGroup<InvoiceRequest>(InvoiceRequest);
        const invoice: InvoiceRequest = formGroup.value!;
    }
```

It accepts an optional second parameter *fromId* if you want to retrieve a particular (non-default) form.

Example

```
    ngOnInit(): void {
        const defaultFormGroup = toFormGroup<InvoiceRequest>(InvoiceRequest);
        const defaultInvoice: InvoiceRequest = defaultFormGroup.value!;
        
        const editFormGroup = toFormGroup<InvoiceRequest>(InvoiceRequest, "editForm");
        const editInvoice: InvoiceRequest = editFormGroup.value!;
    }
```

## Function `toFormGroups<Type>(Type, FormIdType[])`

Same as `toFromGroup`, but gives an array of form groups associated to this `Type` depending on the array of *formId* supplied.
If empty array is supplied, it will return all form groups associated to the given `Type`

Example:

```
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

Enjoy :)

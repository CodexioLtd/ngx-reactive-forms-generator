import {AsyncValidatorFn, FormControl, FormControlOptions, FormGroup, ValidatorFn} from "@angular/forms";

type FormIdType = string | string[] | undefined;
const METADATA: any = {}


export class ModelFormGroup<T> extends FormGroup {
    override readonly value: T | null = null;
}

export const DEFAULT_GROUP = "!A!N!S!R!!!THIS_IS_THE_DEFAULT_GROUP_ID!!A!N!S!R!";

/**
 * Decorator used on a class to denote that
 * this class will be a target type if a form group value.
 *
 * If your class will be a target of multiple forms,
 * which have different options, validators, and
 * maybe subset of fields, you can use this decorator
 * multiple times, denoting a unique identifier called
 * <strong>formId</strong>. Then each validator and form control which
 * is participating in the particular form group should
 * share the same <strong>formId</strong>
 *
 * Usage:
 * <pre><code>
 *
 *     @FormGroupTarget()
 *     @FormGroupTarget("editForm")
 *     class InvoiceRequest {
 *
 *     }
 *
 * </code></pre>
 *
 * @param formId {FormIdType}
 * @constructor
 */
export function FormGroupTarget(formId: FormIdType = undefined) {
    return (target: any) => {
        initializeMetadata(target, formId);
    }
}

/**
 * Decorator used on a class to denote that
 * this class, which is already a target of
 * a form group (@see @FormGroupTarget)
 * will have synchronous validators.
 *
 * In order to add different validators to
 * different form groups of the same type,
 * an additional parameter <strong>formId</strong>
 * should be supplied
 *
 * Example:
 * <pre><code>
 *
 *     @FormGroupTarget()
 *     @FormGroupValidators(Validators.email)
 *
 *     @FormGroupTarget("editForm")
 *     @FormGroupValidators(Validators.requiredTrue, "editForm")
 *     class InvoiceRequest {
 *
 *     }
 *
 * </code></pre>
 *
 * If two or more forms share the same validators,
 * an array of <strong>formId</strong> could be supplied,
 * so they will reflect in all of them.
 * If you do not name your default form group, a formId will
 * be assigned from the library. In order to access it later
 * (e.g. in the <strong>formId</strong> array) use the
 * <strong>DEFAULT_GROUP</strong> constant.
 *
 * Example:
 * <pre><code>
 *
 *     @FormGroupTarget()
 *     @FormGroupTarget("editForm")
 *     @FormGroupValidators([Validators.email, Validators.requiredTrue], [DEFAULT_GROUP, "editForm"])
 *     class InvoiceRequest {
 *
 *     }
 *
 * </code></pre>
 *
 * @param validators {ValidatorFn | ValidatorFn[]}
 * @param formId {FormIdType}
 * @constructor
 */
export function FormGroupValidators(validators: ValidatorFn | ValidatorFn[], formId: FormIdType = undefined) {
    return (target: any) => {
        initializeMetadata(target, formId);
        getFormGroups(target, formId).forEach(formGroup => formGroup.addValidators(validators))
    }
}

/**
 * Decorator used on a class to denote that
 * this class, which is already a target of
 * a form group (@see @FormGroupTarget)
 * will have asynchronous validators.
 *
 * In order to add different validators to
 * different form groups of the same type,
 * an additional parameter <strong>formId</strong>
 * should be supplied
 *
 * Example:
 * <pre><code>
 *
 *     @FormGroupTarget()
 *     @FormGroupValidators(Validators.email)
 *     @FormGroupAsyncValidators(ctrl => of({ value: ctrl.value}))
 *
 *     @FormGroupTarget("editForm")
 *     @FormGroupValidators(Validators.requiredTrue, "editForm")
 *     @FormGroupAsyncValidators(ctrl => of({ empty: !ctrl.value}))
 *     class InvoiceRequest {
 *
 *     }
 *
 * </code></pre>
 *
 * If two or more forms share the same validators,
 * an array of <strong>formId</strong> could be supplied,
 * so they will reflect in all of them.
 * If you do not name your default form group, a formId will
 * be assigned from the library. In order to access it later
 * (e.g. in the <strong>formId</strong> array) use the
 * <strong>DEFAULT_GROUP</strong> constant.
 *
 * Example:
 * <pre><code>
 *
 *     @FormGroupTarget()
 *     @FormGroupTarget("editForm")
 *     @FormGroupValidators([Validators.email, Validators.requiredTrue], [DEFAULT_GROUP, "editForm"])
 *     @FormGroupAsyncValidators([ctrl => of({ value: ctrl.value}), ctrl => of({ empty: !ctrl.value})], [DEFAULT_GROUP, "editForm"])
 *     class InvoiceRequest {
 *
 *     }
 *
 * </code></pre>
 *
 * @param validators {AsyncValidatorFn | AsyncValidatorFn[]}
 * @param formId {FormIdType}
 * @constructor
 */
export function FormGroupAsyncValidators(validators: AsyncValidatorFn | AsyncValidatorFn[], formId: FormIdType = undefined) {
    return (target: any) => {
        initializeMetadata(target, formId);
        getFormGroups(target, formId).forEach(formGroup => formGroup.addAsyncValidators(validators))
    }
}

/**
 * Decorator used on a <strong>field/property</strong> or a
 * constructor <strong>parameter</strong> to denote that
 * this property is a <strong>FormControl</strong>
 *
 * Same as @see FormGroupValidators it can be associated
 * to a particular form group by supplied <strong>formId</strong>.
 *
 * This decorator also accepts as an argument on or more
 * Validators or FormControlOptions (optionally).
 *
 * Example:
 *
 * <pre><code>
 *     @FormGroupTarget()
 *     @FormGroupValidators(Validators.email)
 *     @FormGroupAsyncValidators(ctrl => of({ value: ctrl.value}))
 *
 *     @FormGroupTarget("editForm")
 *     @FormGroupValidators(Validators.requiredTrue, "editForm")
 *     @FormGroupAsyncValidators(ctrl => of({ empty: !ctrl.value}))
 *     class InvoiceRequest {
 *
 *       @FormControlTarget(Validators.required)
 *       @FormControlTarget(Validators.minLength(3), "editForm")
 *       public num: string = '001';
 *
 *       constructor(
 *           @FormControlTarget([], "editForm")
 *           public date: Date = new Date()
 *       ) { }
 *     }
 *  </code></pre>
 *
 *  If a form control shares the same settings on two or more
 *  form groups, an array of <strong>formId</strong> can be supplied
 *
 * Example:
 *
 * <pre><code>
 *     @FormGroupTarget()
 *     @FormGroupValidators(Validators.email)
 *     @FormGroupAsyncValidators(ctrl => of({ value: ctrl.value}))
 *
 *     @FormGroupTarget("editForm")
 *     @FormGroupValidators(Validators.requiredTrue, "editForm")
 *     @FormGroupAsyncValidators(ctrl => of({ empty: !ctrl.value}))
 *     class InvoiceRequest {
 *
 *       @FormControlTarget([Validators.required, Validators.minLength(3)], [DEFAULT_GROUP, "editForm"])
 *       public num: string = '001';
 *
 *       constructor(
 *           @FormControlTarget([], [DEFAULT_GROUP, "editForm"])
 *           public date: Date = new Date()
 *       ) { }
 *     }
 *  </code></pre>
 *
 * @param validatorsOrOptions {ValidatorFn | ValidatorFn[] | FormControlOptions}
 * @param formId {FormIdType}
 * @constructor
 */
export function FormControlTarget(validatorsOrOptions: ValidatorFn | ValidatorFn[] | FormControlOptions | null = null, formId: string | string[] | undefined = undefined) {
    return (target: any, propName: string, descriptor: any = null) => {
        const type = target.constructor.name == Function.name
            ? target
            : target.constructor;

        if (descriptor != undefined) {
            propName = Object.keys(new target())[descriptor];
        }

        initializeMetadata(type, formId);

        getFormGroups(type, formId).forEach(formGroup => {
            if (!formGroup.get(propName)) {
                formGroup.addControl(propName, new FormControl(
                    new type()[propName],
                    validatorsOrOptions
                ));
            } else {
                const ctrl = formGroup.get(propName);
                formGroup.removeControl(propName);
                formGroup.addControl(propName, new FormControl(
                    ctrl?.value,
                    validatorsOrOptions,
                    ctrl?.asyncValidator
                ));
            }
        });
    }
}

/**
 * Decorator used on a <strong>field/property</strong> or a
 * constructor <strong>parameter</strong> to denote that
 * this form control has asynchronous validators.
 *
 * Same as @see FormGroupValidators it can be associated
 * to a particular form group by supplied <strong>formId</strong>.
 *
 *
 * Example:
 *
 * <pre><code>
 *     @FormGroupTarget()
 *     @FormGroupValidators(Validators.email)
 *     @FormGroupAsyncValidators(ctrl => of({ value: ctrl.value}))
 *
 *     @FormGroupTarget("editForm")
 *     @FormGroupValidators(Validators.requiredTrue, "editForm")
 *     @FormGroupAsyncValidators(ctrl => of({ empty: !ctrl.value}))
 *     class InvoiceRequest {
 *
 *       @FormControlTarget(Validators.required)
 *       @FormControlTarget(Validators.minLength(3), "editForm")
 *       @FormControlAsyncValidators(ctrl => of({ ok: ctrl.state == 'VALID'}))
 *       @FormControlAsyncValidators(ctrl => of({ notOk: ctrl.state != 'VALID'}), "editForm")
 *       public num: string = '001';
 *
 *       constructor(
 *           @FormControlTarget([], "editForm")
 *           @FormControlAsyncValidators(ctrl => of({ ok: ctrl.state == 'VALID'}))
 *           public date: Date = new Date()
 *       ) { }
 *     }
 *  </code></pre>
 *
 *  If a form control shares the same async validators on two or more
 *  form groups, an array of <strong>formId</strong> can be supplied
 *
 * Example:
 *
 * <pre><code>
 *     @FormGroupTarget()
 *     @FormGroupValidators(Validators.email)
 *     @FormGroupAsyncValidators(ctrl => of({ value: ctrl.value}))
 *
 *     @FormGroupTarget("editForm")
 *     @FormGroupValidators(Validators.requiredTrue, "editForm")
 *     @FormGroupAsyncValidators(ctrl => of({ empty: !ctrl.value}))
 *     class InvoiceRequest {
 *
 *       @FormControlTarget([Validators.required, Validators.minLength(3)], [DEFAULT_GROUP, "editForm"])
 *       @FormControlAsyncValidators([ctrl => of({ ok: ctrl.state == 'VALID'}), ctrl => of({ notOk: ctrl.state != 'VALID'})], [DEFAULT_GROUP, "editForm"])
 *       public num: string = '001';
 *
 *       constructor(
 *           @FormControlTarget([], [DEFAULT_GROUP, "editForm"])
 *           @FormControlAsyncValidators(ctrl => of({ ok: ctrl.state == 'VALID'}), [DEFAULT_GROUP, "editForm"])
 *           public date: Date = new Date()
 *       ) { }
 *     }
 *  </code></pre>
 *
 * @param validators {AsyncValidatorFn | AsyncValidatorFn[]}
 * @param formId {FormIdType}
 * @constructor
 */
export function FormControlAsyncValidators(validators: AsyncValidatorFn | AsyncValidatorFn[], formId: string | string[] | undefined = undefined) {
    return (target: any, propName: string, descriptor: any = null) => {
        const type = target.constructor.name == Function.name
            ? target
            : target.constructor;

        if (descriptor != undefined) {
            propName = Object.keys(new target())[descriptor];
        }

        initializeMetadata(type, formId);

        getFormGroups(type, formId).forEach(formGroup => {
            if (!formGroup.get(propName)) {
                formGroup.addControl(propName, new FormControl(
                    new type()[propName],
                    null,
                    validators
                ));
            } else {
                formGroup.get(propName)?.addAsyncValidators(validators);
            }
        });
    }
}

/**
 * Decorator used on a <strong>field/property</strong> or a
 * constructor <strong>parameter</strong> to denote that
 * this form control is actually a previously defined form group,
 * in other words - a nested form group.
 *
 * This is the equivalent of:
 *
 * <pre><code>
 *     const topLevelFormGroup = new FormGroup({
 *         fieldOne: new FormControl(...),
 *         nestedFormGroup: new FormGroup({  // <---- this
 *             nestedFieldInNestedGroup: new FormControl(...)
 *         })
 *     });
 * </code></pre>
 *
 *
 * Same as @see FormGroupValidators it can be associated
 * to a particular form group by supplied <strong>targetFormId</strong>.
 *
 * Also, since the nested entity may define more than one form group
 * as described the nature of the decorators above, the second parameter
 * <strong>sourceFormId</strong> actually chooses which of them to nest.
 *
 *
 * Example (Basic):
 *
 * <pre><code>
 *
 *     @FormGroupTarget()
 *     class SupplierRequest {
 *
 *         @FormControlTarget()
 *         public name: string = '';
 *
 *         @FormControlTarget()
 *         public address: string = '';
 *     }
 *
 *     @FormGroupTarget()
 *     @FormGroupValidators(Validators.email)
 *     @FormGroupAsyncValidators(ctrl => of({ value: ctrl.value}))
 *
 *     @FormGroupTarget("editForm")
 *     @FormGroupValidators(Validators.requiredTrue, "editForm")
 *     @FormGroupAsyncValidators(ctrl => of({ empty: !ctrl.value}))
 *     class InvoiceRequest {
 *
 *       @FormControlTarget(Validators.required)
 *       @FormControlTarget(Validators.minLength(3), "editForm")
 *       @FormControlAsyncValidators(ctrl => of({ ok: ctrl.state == 'VALID'}))
 *       @FormControlAsyncValidators(ctrl => of({ notOk: ctrl.state != 'VALID'}), "editForm")
 *       public num: string = '001';
 *
 *       constructor(
 *           @FormControlTarget([], "editForm")
 *           @FormControlAsyncValidators(ctrl => of({ ok: ctrl.state == 'VALID'}))
 *           public date: Date = new Date(),
 *
 *           @NestedFormGroup(SupplierRequest)
 *           public supplier: SupplierRequest = new SupplierRequest()
 *       ) { }
 *     }
 *  </code></pre>
 *
 *  If the nested form group (the SupplierRequest) defines more than
 *  one form group, we can choose which one of them to nest.
 *
 * Example:
 *
 * <pre><code>
 *
 *     @FormGroupTarget()
 *     @FormGroupTarget("validatedSupplier")
 *     class SupplierRequest {
 *
 *         @FormControlTarget()
 *         @FormControlTarget(Validators.required, "validatedSupplier")
 *         public name: string = '';
 *
 *         @FormControlTarget()
 *         @FormControlTarget(Validators.required, "validatedSupplier")
 *         public address: string = '';
 *     }
 *
 *     @FormGroupTarget()
 *     @FormGroupValidators(Validators.email)
 *     @FormGroupAsyncValidators(ctrl => of({ value: ctrl.value}))
 *
 *     @FormGroupTarget("editForm")
 *     @FormGroupValidators(Validators.requiredTrue, "editForm")
 *     @FormGroupAsyncValidators(ctrl => of({ empty: !ctrl.value}))
 *     class InvoiceRequest {
 *
 *       @FormControlTarget(Validators.required)
 *       @FormControlTarget(Validators.minLength(3), "editForm")
 *       @FormControlAsyncValidators(ctrl => of({ ok: ctrl.state == 'VALID'}))
 *       @FormControlAsyncValidators(ctrl => of({ notOk: ctrl.state != 'VALID'}), "editForm")
 *       public num: string = '001';
 *
 *       constructor(
 *           @FormControlTarget([], "editForm")
 *           @FormControlAsyncValidators(ctrl => of({ ok: ctrl.state == 'VALID'}))
 *           public date: Date = new Date(),
 *
 *           @NestedFormGroup(SupplierRequest, "validatedSupplier")
 *           public supplier: SupplierRequest = new SupplierRequest()
 *       ) { }
 *     }
 *  </code></pre>
 *
 *  In the previous example we have nested the <strong>validatedSupplier</strong>
 *  form group to the default form group of <strong>InvoiceRequest</strong>. We can choose to nest it
 *  to <strong>editForm</strong> or to all of them
 *
 *  Example:
 *
 * <pre><code>
 *
 *     @FormGroupTarget()
 *     @FormGroupTarget("validatedSupplier")
 *     class SupplierRequest {
 *
 *         @FormControlTarget()
 *         @FormControlTarget(Validators.required, "validatedSupplier")
 *         public name: string = '';
 *
 *         @FormControlTarget()
 *         @FormControlTarget(Validators.required, "validatedSupplier")
 *         public address: string = '';
 *     }
 *
 *     @FormGroupTarget()
 *     @FormGroupValidators(Validators.email)
 *     @FormGroupAsyncValidators(ctrl => of({ value: ctrl.value}))
 *
 *     @FormGroupTarget("editForm")
 *     @FormGroupValidators(Validators.requiredTrue, "editForm")
 *     @FormGroupAsyncValidators(ctrl => of({ empty: !ctrl.value}))
 *     class InvoiceRequest {
 *
 *       @FormControlTarget(Validators.required)
 *       @FormControlTarget(Validators.minLength(3), "editForm")
 *       @FormControlAsyncValidators(ctrl => of({ ok: ctrl.state == 'VALID'}))
 *       @FormControlAsyncValidators(ctrl => of({ notOk: ctrl.state != 'VALID'}), "editForm")
 *       public num: string = '001';
 *
 *       constructor(
 *           @FormControlTarget([], "editForm")
 *           @FormControlAsyncValidators(ctrl => of({ ok: ctrl.state == 'VALID'}))
 *           public date: Date = new Date(),
 *
 *           @NestedFormGroup(SupplierRequest, "validatedSupplier", [DEFAULT_GROUP, "editForm"])
 *           public supplier: SupplierRequest = new SupplierRequest()
 *       ) { }
 *     }
 *  </code></pre>
 *
 * @param sourceType The source type that is previously defining a form group, e.g. <strong>SupplierRequest</strong>
 * @param sourceFormId Optional form id of the nested type, if it defines more than one form group
 * @param targetFormId {FormIdType} The target form id(s) which needs the nesting
 * @constructor
 */
export function NestedFormGroup(sourceType: any, sourceFormId: string | undefined = undefined, targetFormId: FormIdType = undefined) {
    return (target: any, propName: string, descriptor: any = null) => {
        const type = target.constructor.name == Function.name
            ? target
            : target.constructor;

        if (descriptor != undefined) {
            propName = Object.keys(new target())[descriptor];
        }

        initializeMetadata(type, targetFormId);

        getFormGroups(type, targetFormId).forEach(formGroup => {
            let nestedFormGroup = (getFormGroups(sourceType, sourceFormId) || [])[0];
            if (nestedFormGroup) {
                formGroup.addControl(propName, nestedFormGroup);
            }
        });
    }
}

/**
 * This function returns a FormGroup (in particular an
 * enhanced <strong>ModelFormGroup</strong> which <strong>value</strong>
 * property will be of a generic type supplied) based on the decorators
 * upon a class.
 *
 * Example:
 *
 * <pre><code>
 *     ngOnInit(): void {
 *         const formGroup = toFormGroup<InvoiceRequest>(InvoiceRequest);
 *         const invoice: InvoiceRequest = formGroup.value;
 *     }
 * </code></pre>
 *
 * @param type Any given type e.g. InvoiceRequest
 * @param formId {FormIdType}
 */
export function toFormGroup<T>(type: any, formId: string | null = null): ModelFormGroup<T> {
    const f = formId ? formId : type.name;
    return METADATA[type][f];
}

export function toFormGroups<T>(t: any, formIds: string[] = []): ModelFormGroup<T>[] {
    if (formIds.length > 0) {
        return formIds.map(f => METADATA[t][f]);
    }

    return METADATA[t];
}

function getFormGroups(target: any, formId: FormIdType): FormGroup[] {
    return normalizeFormId(target, formId).map(f => METADATA[target][f]);
}

function normalizeFormId(type: any, formId: FormIdType = undefined): string[] {
    const forms = !!formId ? (Array.isArray(formId) ? formId : [formId]) : [type.name];

    return forms.map(f => f === DEFAULT_GROUP ? type.name : f);
}

function initializeMetadata(target: any, formId: FormIdType = undefined) {
    if (!METADATA[target]) {
        METADATA[target] = {}
    }

    formId = normalizeFormId(target, formId);

    formId.forEach(f => {
        if (!METADATA[target][f]) {
            METADATA[target][f] = new FormGroup({})
        }
    })

}


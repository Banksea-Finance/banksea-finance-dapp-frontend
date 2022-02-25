import { AccountNamespace, Idl } from '@project-serum/anchor'

type ExtractPromiseGeneric<Type> = Type extends Promise<infer X> ? X : never

type AccountNames<IDL extends Idl> = keyof AccountNamespace<IDL>

type PropOfType<Type, Prop extends keyof Type> = Type[Prop]

export type AccountFromIDL<IDL extends Idl, AccountName extends AccountNames<IDL>> = ExtractPromiseGeneric<
  ReturnType<PropOfType<AccountNamespace<IDL>, AccountName>['fetch']>
>

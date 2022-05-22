interface Context {}

class Flavor<C extends Context> {
  constructor(private readonly ctx: C) {}
}

type FlavorContext<C extends Context> = C & {
  flavor: Flavor<C>
}

const useFlavor = <C extends FlavorContext<Context>>(ctx: C) => {
  ctx.flavor = new Flavor(ctx)
}

class A<T> {
  constructor() {

  }
  transform<V extends T>(): A<V> {
    return new A<V>()
  } 
}

class B<T> {
  c = B
  constructor() {

  }

  static make<V>(s: string) {
    return new B<V>()
  }

  transform<V extends T>() {
    return this.c.make<V>('s')
  }
}

class C<T> extends B<T> {
  c = C
  constructor() {
    super()
  }
  static make<V>(s: string) {
    return new C<V>()
  }

  transformNew<V extends T>() {
    return this.c.make<V>('s')
  }
}

const c = new C<{a: string}>()





const f = c.transform<{a: string, b: number}>()





const f2 = c.transformNew<{a: string, b: number}>()



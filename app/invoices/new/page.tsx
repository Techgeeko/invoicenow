'use client';

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createAction } from "@/lib/actions/actions";
import { SyntheticEvent, useState } from "react";
import Form from "next/form";
import Container from "@/components/shared/container";



export default function Dashboard() {
  const [state, setState] = useState('ready');

  const handleOnSubmit = async (e: SyntheticEvent) => {
    if ( state === 'pending' ) {
      e.preventDefault();
    return;
    }
    setState('pending');
    console.log('submitting form');
  }

  return (
    <main className="flex flex-col max-w-5xl justify-center gap-6 h-full mx-auto my-12">
      <Container>
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Create Invoice</h1>
      </div>

      <Form action={createAction} onSubmit={handleOnSubmit} className="grid gap-4 max-w-xs">
        <div>
          <Label className="block font-semibold text-sm mb-2" htmlFor="name">Billing Name</Label>
          <Input type="text" id="name" name="name" />
        </div>
        <div>
          <Label className="block font-semibold text-sm mb-2" htmlFor="email">Billing Email</Label>
          <Input type="email" id="email" name="email" />
        </div>
        <div>
          <Label className="block font-semibold text-sm mb-2" htmlFor="value">Value</Label>
          <Input type="text" id="value" name="value" />
        </div>
        <div>
          <Label className="block font-semibold text-sm mb-2" htmlFor="description">Description</Label>
          <Textarea id="description" name="description" />
        </div>
        <div>
          <Button type="submit" className="w-full font-semibold">
            Submit
          </Button>
        </div>
      </Form>
      </Container>
    </main>
  );
}

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { type Control, type Path, type FieldValues } from "react-hook-form";
import * as React from "react";

interface ControlInputProps<TFieldValues extends FieldValues = FieldValues> 
    extends Omit<React.ComponentProps<"input">, "name"> {
    control: Control<TFieldValues>;
    name: Path<TFieldValues>;
    label: string;
    description?: string;
    password?: boolean;
}


export function ControlInput<TFieldValues extends FieldValues = FieldValues>({ control, name, label, description, password, ...props }: ControlInputProps<TFieldValues>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <Input password={password} {...field} {...props} />
                </FormControl>
                {description && (
                    <FormDescription>
                        {description}
                    </FormDescription>
                )}
                <FormMessage />
            </FormItem>
            )}
        />
    )
}
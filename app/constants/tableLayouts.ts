import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { Layouts } from "~/models";

export function getLayoutsColumns(options: {
    onEdit: (row: Layouts) => void;
    onDelete: (row: Layouts) => void;
}): TableColumn<Layouts>[] {
    const UButton = resolveComponent("UButton");

    return [
        { accessorKey: "name", header: "Name" },
        { accessorKey: "grid_size_x", header: "Grid Size X" },
        { accessorKey: "grid_size_y", header: "Grid Size Y" },
        { accessorKey: "seat_count", header: "Seat Count" },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                h("div", { class: "flex items-center gap-2" }, [
                    h(UButton, {
                        icon: "i-lucide-pencil",
                        color: "neutral",
                        variant: "solid",
                        size: "sm",
                        "aria-label": "Edit",
                        onClick: () => options.onEdit(row.original),
                    }),
                    h(UButton, {
                        icon: "i-lucide-trash-2",
                        color: "error",
                        variant: "solid",
                        size: "sm",
                        "aria-label": "Delete",
                        onClick: () => options.onDelete(row.original),
                    }),
                ]);
            },
        },
    ];
}

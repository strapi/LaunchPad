/* eslint-disable @typescript-eslint/no-explicit-any */

import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
import { MentionList } from "@/components/editor/mention-list"; // We'll create this component next
import { useThemePresetStore } from "@/store/theme-preset-store"; // Import the theme store

export const suggestion = {
  items: ({ query }: { query: string }) => {
    // Get all presets from the store
    const allPresets = useThemePresetStore.getState().getAllPresets();

    // Convert presets object to the required array format { id: string, label: string }
    const themeItems = Object.entries(allPresets).map(([id, preset]) => ({
      id: id, // Use the preset key as the id
      label: preset.label, // Use the preset label
    }));

    // Filter based on the query
    return themeItems
      .filter((item) => {
        const labelWithoutSpaces =
          item.label?.replace(/\s+/g, "").toLowerCase() || "";
        const queryWithoutSpaces = query.replace(/\s+/g, "").toLowerCase();
        return labelWithoutSpaces.includes(queryWithoutSpaces);
      })
      .slice(0, 7)
      .concat({ id: "editor:current-changes", label: "Current Theme" }); // Limit to 5 suggestions
  },

  render: () => {
    let component: ReactRenderer | null = null;
    let popup: any | null = null;

    return {
      onStart: (props: any) => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate(props: any) {
        component?.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup?.[0]?.setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props: any) {
        if (props.event.key === "Escape") {
          popup?.[0]?.hide();
          return true;
        }

        // @ts-expect-error - This is a valid way to access the component's methods
        return component?.ref?.onKeyDown(props);
      },

      onExit() {
        popup?.[0]?.destroy();
        component?.destroy();
        popup = null;
        component = null;
      },
    };
  },
};

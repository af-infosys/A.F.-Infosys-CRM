import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// 1. Sortable Field Wrapper Component
// Yeh component har ek form field ko draggable banayega
const SortableField = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 mb-4 p-2 bg-white rounded shadow-sm border border-gray-200"
    >
      {/* Drag Handle: Yahan se pakad kar drag karenge */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab text-gray-400 hover:text-gray-800 p-2 touch-none"
        title="Drag to reorder"
      >
        <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor">
          <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-12a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
        </svg>
      </button>

      {/* Actual Form Field Content */}
      <div className="flex-grow w-full">{children}</div>
    </div>
  );
};

// 2. Main Form Component
export default function DynamicOrderForm({
  formData,
  handleChange,
  handleSubmit,
  formLoading,
  customerCategory,
  villages,
  talukas,
  districts,
}) {
  // Default order of fields based on unique IDs
  const defaultFieldOrder = [
    "serialNumber",
    "customerFullName",
    "category",
    "village",
    "mobileNo",
    "villageOfCharge",
    "talukoJilla",
    "listReceived",
  ];

  // State initialization with LocalStorage sync
  const [fieldOrder, setFieldOrder] = useState(() => {
    const savedOrder = localStorage.getItem("formFieldOrder");
    return savedOrder ? JSON.parse(savedOrder) : defaultFieldOrder;
  });

  // Touch & Mouse sensors (Touch screen aur Mouse dono ke liye support)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px drag hone par hi drag start hoga taaki normal click disturb na ho
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Drag Drop ke baad state update aur localStorage me save karna
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setFieldOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);

        // Save to LocalStorage automatically
        localStorage.setItem("formFieldOrder", JSON.stringify(newOrder));
        return newOrder;
      });
    }
  };

  // 3. Form Fields Dictionary
  // Yahan hum define kar rahe hain ki kis ID par kaunsa HTML render hoga
  const fieldComponents = {
    serialNumber: (
      <div className="form-field">
        <label htmlFor="serialNumber" className="form-label block mb-1">
          અનું ક્રમાંક
        </label>
        <input
          type="number"
          id="serialNumber"
          name="serialNumber"
          className="form-input w-full"
          placeholder="દા.ત. 001"
          value={formData?.serialNumber || ""}
          onChange={handleChange}
          disabled={formLoading}
          required
          style={{ maxWidth: "82px" }}
          maxLength="5"
        />
      </div>
    ),
    customerFullName: (
      <div className="form-field">
        <label htmlFor="customerFullName" className="form-label block mb-1">
          ગ્રાહકનું & કસ્ટમર પુરૂ નામ
        </label>
        <input
          type="text"
          id="customerFullName"
          name="customerFullName"
          className="form-input w-full"
          placeholder="customer Full Name"
          value={formData?.customerFullName || ""}
          onChange={handleChange}
          disabled={formLoading}
          required
        />
      </div>
    ),
    category: (
      <div className="form-field">
        <label htmlFor="category" className="form-label block mb-1">
          કેટેગરી
        </label>
        <select
          id="category"
          name="category"
          className="form-select w-full"
          value={formData?.category || ""}
          onChange={handleChange}
          disabled={formLoading}
          style={{ maxWidth: "200px" }}
        >
          {customerCategory?.map((category, index) => (
            <option key={index} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>
    ),
    village: (
      <div className="form-field md:col-span-2">
        <label htmlFor="village" className="form-label block mb-1">
          ગામ
        </label>
        <input
          list="village-options"
          type="text"
          id="village"
          name="village"
          className="form-input w-full"
          placeholder="village"
          value={formData?.village || ""}
          onChange={handleChange}
          disabled={formLoading}
          style={{ maxWidth: "200px" }}
        />
        <datalist id="village-options">
          {villages?.map((village, index) => (
            <option key={index} value={village} />
          ))}
        </datalist>
      </div>
    ),
    mobileNo: (
      <div className="form-field">
        <label htmlFor="mobileNo" className="form-label block mb-1">
          મોબાઈલ નંબર
        </label>
        <input
          type="text"
          id="mobileNo"
          name="mobileNo"
          className="form-input w-full"
          placeholder="e.g. 7201840095"
          value={formData?.mobileNo || ""}
          onChange={handleChange}
          disabled={formLoading}
          style={{ maxWidth: "250px" }}
        />
      </div>
    ),
    villageOfCharge: (
      <div className="form-field">
        <label htmlFor="villageOfCharge" className="form-label block mb-1">
          ચાર્જ નું ગામ
        </label>
        <input
          type="text"
          id="villageOfCharge"
          name="villageOfCharge"
          className="form-input w-full"
          value={formData?.villageOfCharge || ""}
          onChange={handleChange}
          disabled={formLoading}
          style={{ maxWidth: "200px" }}
        />
      </div>
    ),
    talukoJilla: (
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <div className="form-field">
          <label htmlFor="taluko" className="form-label block mb-1">
            તાલુકો
          </label>
          <input
            list="taluka-options"
            type="text"
            id="taluko"
            name="taluko"
            className="form-input w-full"
            value={formData?.taluko || ""}
            onChange={handleChange}
            disabled={formLoading}
          />
          <datalist id="taluka-options">
            {talukas?.map((t, i) => (
              <option key={i} value={t} />
            ))}
          </datalist>
        </div>

        <div className="form-field">
          <label htmlFor="jilla" className="form-label block mb-1">
            જિલ્લો
          </label>
          <input
            list="district-options"
            type="text"
            id="jilla"
            name="jilla"
            className="form-input w-full"
            value={formData?.jilla || ""}
            onChange={handleChange}
            disabled={formLoading}
          />
          <datalist id="district-options">
            {districts?.map((d, i) => (
              <option key={i} value={d} />
            ))}
          </datalist>
        </div>
      </div>
    ),
    listReceived: (
      <div className="form-field">
        <label htmlFor="listReceived" className="form-label block mb-1">
          કમ્પની ને મળેલ તારીખ
        </label>
        <input
          type="date"
          id="listReceived"
          name="listReceived"
          className="form-input w-full"
          value={formData?.listReceived || ""}
          onChange={handleChange}
          disabled={formLoading}
        />
      </div>
    ),
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-50 rounded-lg">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={fieldOrder}
          strategy={verticalListSortingStrategy}
        >
          {/* Hum dynamically fieldOrder array ke through iterate kar rahe hain */}
          {fieldOrder.map((id) => (
            <SortableField key={id} id={id}>
              {fieldComponents[id]}
            </SortableField>
          ))}
        </SortableContext>
      </DndContext>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="submit-button px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={formLoading}
        >
          Submit
        </button>
      </div>
    </form>
  );
}
